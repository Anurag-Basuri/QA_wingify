// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

/**
 * Playwright configuration for Dream Portal test automation.
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  
  /* Maximum time one test can run */
  timeout: 30000,
  
  /* Assertion timeout */
  expect: {
    timeout: 10000,
  },

  /* Run tests sequentially for consistent results */
  fullyParallel: false,
  workers: 1,


  /* Fail the build on CI if test.only is left in source code */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests once */
  retries: 1,

  /* Reporter configuration */
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['list'],
  ],

  /* Shared settings for all projects */
  use: {
    baseURL: process.env.BASE_URL || 'https://arjitnigam.github.io/myDreams/',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Collect trace on failure */
    trace: 'retain-on-failure',

    /* Browser viewport */
    viewport: { width: 1280, height: 720 },
  },

  /* Browser projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
