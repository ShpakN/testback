import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const isRemote = !BASE_URL.includes('localhost') && !BASE_URL.includes('127.0.0.1');

export default defineConfig({
  testDir: '../e2e',
  testMatch: '**/*.spec.ts',
  testIgnore: ['**/node_modules/**', '**/src/**', '**/dist/**', '**/*.test.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
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

  webServer: [
  {
    command: "node server.js",        
    cwd: "../backend",
    url: "http://localhost:5000/api/products",  // чтобы Playwright ждал готовности
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  {
    command: "npm run dev",
    cwd: "../frontend",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  }
],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
});

