const { expect } = require('@playwright/test');
const Logger = require('../utils/logger');

// Page Object Model for the Dream Portal home page (index.html)
// Handles the loading animation, main content, and navigation logic
class HomePage {
  // Set up the page and define all the locators we need
  constructor(page) {
    this.page = page;
    this.logger = new Logger('HomePage');

    // Locators for all the elements on the page
    this.loadingAnimation = page.locator('#loadingAnimation');
    this.mainContent = page.locator('#mainContent');
    this.dreamButton = page.locator('#dreamButton');
    this.statNumbers = page.locator('.stat-number');
    this.welcomeSection = page.locator('#welcome-section');
    this.spinner = page.locator('.spinner');
  }

  // Navigate to the home page and wait for the welcome section to appear
  async goto() {
    this.logger.info('Navigating to Dream Portal home page');
    await this.page.goto('./', { waitUntil: 'commit' });
    // Wait for the welcome section to be attached to the DOM
    await this.welcomeSection.waitFor({ state: 'attached', timeout: 10000 });
    this.logger.info('Home page loaded successfully');
  }

  // Check if the loading animation is currently visible on screen
  async isLoadingVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('loadingAnimation');
      if (!el) return false;
      return !el.classList.contains('hidden');
    });
    return result;
  }

  // Wait for the loading animation to disappear (should take about 3 seconds)
  async waitForLoadingToDisappear() {
    this.logger.info('Waiting for loading animation to disappear...');
    // Wait for the mainContent to become visible with proper animation classes
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

  // Check if the main content area is currently visible on the page
  async isMainContentVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('mainContent');
      if (!el) return false;
      return !el.classList.contains('hidden');
    });
    return result;
  }

  // Check if the Dream button is visible and ready to click
  async isDreamButtonVisible() {
    const result = await this.page.evaluate(() => {
      const el = document.getElementById('dreamButton');
      if (!el) return false;
      return !el.classList.contains('hidden') && el.classList.contains('show');
    });
    return result;
  }

  // Click the "My Dreams" button which opens two new tabs for dreams-diary and dreams-total
  async clickMyDreamsButton() {
    this.logger.info('Clicking "My Dreams" button');

    // Collect all new pages that open in the next few seconds
    const newPages = [];

    // Listen for the first popup before clicking
    const popupPromise1 = this.page.waitForEvent('popup');
    await this.dreamButton.click();
    const firstPage = await popupPromise1;
    newPages.push(firstPage);

    // The button opens two tabs, so wait for the second one
    try {
      const popupPromise2 = this.page.waitForEvent('popup', { timeout: 5000 });
      const secondPage = await popupPromise2;
      newPages.push(secondPage);
    } catch (e) {
      this.logger.warn('Second popup did not open within timeout');
    }

    // Give each new page a moment to load
    for (const p of newPages) {
      await p.waitForLoadState('domcontentloaded');
    }

    this.logger.info(`Opened ${newPages.length} new tab(s)`);
    return newPages;
  }

  // Get the text displayed on the Dream button
  async getDreamButtonText() {
    // Wait for the button to be visible first
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
