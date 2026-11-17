// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000, // Увеличиваем общий таймаут теста
  use: {
    baseURL: 'https://github.com',
    navigationTimeout: 60_000, // Увеличиваем таймаут навигации
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});