const Logger = require('../utils/logger');

/**
 * Page Object Model for the Dreams Summary Page (dreams-total.html).
 * Handles summary statistics table interactions and data extraction.
 */
class DreamSummaryPage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DreamSummaryPage');

    // Locators
    this.summaryTable = page.locator('#dreamsTotal');
    this.tableRows = page.locator('#dreamsTotal tbody tr');
    this.pageTitle = page.locator('h1');
  }

  /**
   * Navigate to the Dreams Summary page.
   */
  async goto() {
    this.logger.info('Navigating to Dreams Summary page');
    await this.page.goto('dreams-total.html', { waitUntil: 'networkidle' });
    this.logger.info('Dreams Summary page loaded');
  }



  /**
   * Get the value for a specific stat from the summary table.
   * Looks for a row where the first cell matches statName
   * and returns the second cell's value.
   *
   * @param {string} statName - Name of the stat (e.g., "Good Dreams", "Total Dreams")
   * @returns {Promise<string>} The count value as a string
   */
  async getStatValue(statName) {
    const rows = await this.tableRows.all();

    for (const row of rows) {
      const cells = await row.locator('td').all();
      const label = (await cells[0].textContent()).trim();

      if (label === statName) {
        const value = (await cells[1].textContent()).trim();
        this.logger.info(`Stat "${statName}" = ${value}`);
        return value;
      }
    }

    this.logger.error(`Stat "${statName}" not found in the summary table`);
    throw new Error(`Stat "${statName}" not found in the summary table`);
  }

  /**
   * Get all stats from the summary table as an object.
   * @returns {Promise<Object>} Stats object with all summary values
   */
  async getAllStats() {
    const stats = {};
    const rows = await this.tableRows.all();

    for (const row of rows) {
      const cells = await row.locator('td').all();
      const label = (await cells[0].textContent()).trim();
      const value = (await cells[1].textContent()).trim();
      stats[label] = parseInt(value, 10);
    }

    this.logger.info('Extracted all summary stats: ' + JSON.stringify(stats));
    return stats;
  }

  /**
   * Get the page title text.
   * @returns {Promise<string>} The h1 title text
   */
  async getPageTitle() {
    return (await this.pageTitle.textContent()).trim();
  }
}

module.exports = DreamSummaryPage;
