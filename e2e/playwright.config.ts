import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const isCI = !!process.env.CI;
const isRemote = !BASE_URL.includes('localhost') && !BASE_URL.includes('127.0.0.1');

// В CI backend + frontend поднимаются явно в main.yml — webServer не нужен,
// иначе Playwright стартует сервисы повторно поверх уже запущенных.
const useWebServer = !isRemote && !isCI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,   // 1 worker в CI — БД одна, гонки на регистрации
  timeout: 60_000,                 // 60s на тест (было 45s)
  expect: { timeout: 20_000 },     // 20s на expect — toast иногда приходит с задержкой

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],

  use: {
    baseURL: BASE_URL,
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Явный таймаут на сетевые запросы к backend
    extraHTTPHeaders: { 'Accept': 'application/json' },
  },

  webServer: useWebServer
    ? [
        {
          command: 'npm run start:ci',
          cwd: '../backend',
          url: 'http://localhost:5000/',
          reuseExistingServer: true,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
        {
          command: 'npm run dev',
          cwd: '../frontend',
          url: 'http://localhost:5173/',
          reuseExistingServer: true,
          timeout: 120_000,
        },
      ]
    : undefined,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 800 } },
    },
  ],
});
