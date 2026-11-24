import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const isRemote = !BASE_URL.includes('localhost') && !BASE_URL.includes('127.0.0.1');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // В CI — 1 воркер: тесты делят одну БД и один backend
  workers: isCI ? 1 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },

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
  },

  // Локально и в CI Playwright сам поднимает backend + frontend.
  // Для удалённого стенда (BASE_URL не localhost) webServer отключается.
  webServer: isRemote
    ? undefined
    : [
        {
          // start:ci выполняет seed и стартует backend на порту 5000
          command: 'npm run start:ci',
          cwd: '../backend',
          url: 'http://localhost:5000/api/products',
          // В CI всегда стартуем чистый сервер с seed, локально можно переиспользовать
          reuseExistingServer: !isCI,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
        {
          command: 'npm run dev -- --port 5173',
          cwd: '../frontend',
          url: 'http://localhost:5173/',
          reuseExistingServer: !isCI,
          timeout: 120_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
      ],

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
