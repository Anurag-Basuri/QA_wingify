const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const Logger = require('../utils/logger');

const logger = new Logger('HomePageTests');

test.describe('Dream Portal - Home Page', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should display loading animation on page load', async ({ page }) => {
    logger.step('Checking that loading animation is visible on initial page load');

    // Navigate fresh to catch the loading state (before 3s timeout)
    await page.goto('./', { waitUntil: 'commit' });

    // The loading animation should be visible immediately after page load
    const isLoading = await page.evaluate(() => {
      const el = document.getElementById('loadingAnimation');
      return el !== null && !el.classList.contains('hidden');
    });
    expect(isLoading).toBeTruthy();
    logger.info('Loading animation is visible as expected');
  });

  test('should hide loading animation after ~3 seconds', async ({ page }) => {
    logger.step('Verifying loading animation disappears after approximately 3 seconds');

    // Navigate fresh to see the full loading cycle
    await page.goto('./', { waitUntil: 'commit' });

    // Initially, loading should be visible
    const isLoadingInitially = await page.evaluate(() => {
      const el = document.getElementById('loadingAnimation');
      return el !== null && !el.classList.contains('hidden');
    });
    expect(isLoadingInitially).toBeTruthy();

    // Wait for loading to disappear (should happen after ~3 seconds)
    await page.waitForFunction(
      () => {
        const el = document.getElementById('loadingAnimation');
        return el && el.classList.contains('hidden');
      },
      { timeout: 10000 }
    );

    // Verify it's now hidden
    const isLoadingAfter = await page.evaluate(() => {
      const el = document.getElementById('loadingAnimation');
      return el && el.classList.contains('hidden');
    });
    expect(isLoadingAfter).toBeTruthy();
    logger.info('Loading animation disappeared successfully after ~3 seconds');
  });

  test('should show main content after loading completes', async () => {
    logger.step('Checking that main content becomes visible after loading');

    // Wait for loading to complete first
    await homePage.waitForLoadingToDisappear();

    // Main content should now be visible
    const isContentVisible = await homePage.isMainContentVisible();
    expect(isContentVisible).toBeTruthy();

    // Verify the main content has the 'show' class for animation
    const hasShowClass = await homePage.page.evaluate(() => {
      const el = document.getElementById('mainContent');
      return el && el.classList.contains('show');
    });
    expect(hasShowClass).toBeTruthy();

    logger.info('Main content is visible with proper animation class');
  });

  test('should show "My Dreams" button after loading completes', async () => {
    logger.step('Verifying the "My Dreams" button appears after loading');

    // Wait for loading to finish
    await homePage.waitForLoadingToDisappear();

    // Give a brief moment for the button animation
    await homePage.page.waitForTimeout(200);

    // Button should be visible
    const isButtonVisible = await homePage.isDreamButtonVisible();
    expect(isButtonVisible).toBeTruthy();

    // Verify button text
    const buttonText = await homePage.getDreamButtonText();
    expect(buttonText.trim()).toBe('My Dreams');

    logger.info('"My Dreams" button is visible with correct text');
  });

  test('should open Dreams Diary page in a new tab when clicking "My Dreams"', async () => {
    logger.step('Testing that clicking "My Dreams" opens dreams-diary.html in new tab');

    // Wait for loading to complete and button to appear
    await homePage.waitForLoadingToDisappear();
    await homePage.page.waitForTimeout(200);

    // Click button and capture new pages
    const newPages = await homePage.clickMyDreamsButton();

    // At least one page should have opened
    expect(newPages.length).toBeGreaterThanOrEqual(1);

    // Check that dreams-diary.html was opened in one of the new tabs
    const diaryPage = newPages.find((p) =>
      p.url().includes('dreams-diary.html')
    );
    expect(diaryPage).toBeDefined();

    logger.info('Dreams Diary page opened in a new tab successfully');

    // Clean up - close opened tabs
    for (const p of newPages) {
      await p.close();
    }
  });

  test('should open Dreams Summary page in a new tab when clicking "My Dreams"', async () => {
    logger.step(
      'Testing that clicking "My Dreams" opens dreams-total.html in new tab'
    );

    // Wait for loading to complete and button to appear
    await homePage.waitForLoadingToDisappear();
    await homePage.page.waitForTimeout(200);

    // Click button and capture new pages
    const newPages = await homePage.clickMyDreamsButton();

    // Both tabs should have opened
    expect(newPages.length).toBe(2);

    // Check that dreams-total.html was opened in one of the new tabs
    const summaryPage = newPages.find((p) =>
      p.url().includes('dreams-total.html')
    );
    expect(summaryPage).toBeDefined();

    logger.info('Dreams Summary page opened in a new tab successfully');

    // Clean up
    for (const p of newPages) {
      await p.close();
    }
  });
});
