// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

// Playwright configuration for Dream Portal automated testing
// See: https://playwright.dev/docs/test-configuration

module.exports = defineConfig({
  testDir: './tests',
  
  // Each test can run for maximum 30 seconds
  timeout: 30000,
  
  // Assertions must complete within 10 seconds
  expect: {
    timeout: 10000,
  },

  // Run tests one at a time for consistent, reliable results
  fullyParallel: false,
  workers: 1,

  // Prevent accidentally leaving test.only in the code when running on CI
  forbidOnly: !!process.env.CI,

  // Automatically retry failed tests once to reduce flakiness
  retries: 1,

  // Configure different reporters for test results
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright'],
    ['list'],
  ],

  // Global settings applied to all test runs
  use: {
    baseURL: process.env.BASE_URL || 'https://arjitnigam.github.io/myDreams/',

    // Take screenshots when tests fail for debugging
    screenshot: 'only-on-failure',

    // Record videos of failed tests to see what went wrong
    video: 'retain-on-failure',

    // Capture detailed traces for failed tests
    trace: 'retain-on-failure',

    // Standard desktop browser size
    viewport: { width: 1280, height: 720 },
  },

  // Define which browsers to test on
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
