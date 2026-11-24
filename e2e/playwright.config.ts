import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const isRemote = !BASE_URL.includes('localhost') && !BASE_URL.includes('127.0.0.1');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'results/junit.xml' }], // пригодится для quality gates
  ],

  use: {
  baseURL: process.env.BASE_URL ?? "http://localhost:5173",
  navigationTimeout: 30_000,
  actionTimeout: 15_000,
  trace: "on-first-retry",
  video: "retain-on-failure",
  screenshot: "only-on-failure",
},

  // Локальный режим: Playwright сам поднимает backend + frontend.
  // Для удалённого стенда webServer отключается.
  webServer: isRemote
    ? undefined
    : [
        {
          command: 'npm start',
          cwd: '../backend',
          url: 'http://localhost:5000/',
          reuseExistingServer: true,
          timeout: 60_000,
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