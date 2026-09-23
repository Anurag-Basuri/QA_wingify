const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

/**
 * Page Object Model for the Dream Portal Home Page (index.html).
 * Handles loading animation, main content visibility, and navigation.
 */
class HomePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    this.logger = new Logger('HomePage');

    // Locators
    this.loadingAnimation = page.locator('#loadingAnimation');
    this.mainContent = page.locator('#mainContent');
    this.dreamButton = page.locator('#dreamButton');
    this.statNumbers = page.locator('.stat-number');
    this.welcomeSection = page.locator('#welcome-section');
    this.spinner = page.locator('.spinner');
  }

  /**
   * Navigate to the home page.
   */
  async goto() {
    this.logger.info('Navigating to Dream Portal home page');
    await this.page.goto('./', { waitUntil: 'commit' });
    // Wait for the welcome section to be attached to DOM
    await this.welcomeSection.waitFor({ state: 'attached', timeout: 10000 });
    this.logger.info('Home page loaded successfully');
  }

  /**
   * Check if the loading animation is currently visible.
   * Uses JavaScript evaluation since the .hidden class uses display:none.
   * @returns {Promise<boolean>} True if loading animation is visible
   */
  async isLoadingVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('loadingAnimation');
      if (!el) return false;
      return !el.classList.contains('hidden');
    });
    return result;
  }

  /**
   * Wait for the loading animation to disappear.
   * The animation lasts approximately 3 seconds.
   */
  async waitForLoadingToDisappear() {
    this.logger.info('Waiting for loading animation to disappear...');
    // Wait for the mainContent to become visible and animated (100ms delay after hidden removal)
    await this.page.waitForFunction(
      () => {
        const mainContent = document.getElementById('mainContent');
        return (
          mainContent &&
          !mainContent.classList.contains('hidden') &&
          mainContent.classList.contains('show')
        );
      },
      { timeout: 10000 }
    );
    this.logger.info('Loading animation has disappeared and content is shown');
  }

  /**
   * Check if main content is visible after loading.
   * @returns {Promise<boolean>} True if main content is displayed
   */
  async isMainContentVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('mainContent');
      if (!el) return false;
      return !el.classList.contains('hidden');
    });
    return result;
  }

  /**
   * Check if the Dream button is visible and clickable.
   * @returns {Promise<boolean>} True if button is displayed
   */
  async isDreamButtonVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('dreamButton');
      if (!el) return false;
      return !el.classList.contains('hidden') && el.classList.contains('show');
    });
    return result;
  }

  /**
   * Click the "My Dreams" button, which opens two new tabs:
   * - dreams-diary.html
   * - dreams-total.html
   * @returns {Promise<import('@playwright/test').Page[]>} Array of newly opened pages
   */
  async clickMyDreamsButton() {
    this.logger.info('Clicking "My Dreams" button');

    // Collect all new pages that open within a short window
    const newPages = [];

    // Listen for popup events before clicking
    const popupPromise1 = this.page.waitForEvent('popup');
    await this.dreamButton.click();
    const firstPage = await popupPromise1;
    newPages.push(firstPage);

    // The button opens two tabs, wait for the second one
    try {
      const popupPromise2 = this.page.waitForEvent('popup', { timeout: 5000 });
      const secondPage = await popupPromise2;
      newPages.push(secondPage);
    } catch (e) {
      this.logger.warn('Second popup did not open within timeout');
    }

    // Wait for the new pages to load
    for (const p of newPages) {
      await p.waitForLoadState('domcontentloaded');
    }

    this.logger.info(`Opened ${newPages.length} new tab(s)`);
    return newPages;
  }

  /**
   * Get the dream button text.
   * @returns {Promise<string>} The button text content
   */
  async getDreamButtonText() {
    // Wait for button to be visible first
    await this.page.waitForFunction(
      () => {
        const el = document.getElementById('dreamButton');
        return el && el.classList.contains('show');
      },
      { timeout: 10000 }
    );
    return await this.dreamButton.textContent();
  }
}

module.exports = HomePage;
