const Logger = require('../utils/logger');

// Page Object Model for the Dreams Summary page (dreams-total.html)
// Handles reading and extracting summary statistics from the table
class DreamSummaryPage {
  // Set up the page instance and create locators for the summary table
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DreamSummaryPage');

    // Set up locators for all the elements we need
    this.summaryTable = page.locator('#dreamsTotal');
    this.tableRows = page.locator('#dreamsTotal tbody tr');
    this.pageTitle = page.locator('h1');
  }

  // Navigate to the Dreams Summary page and wait for it to load
  async goto() {
    this.logger.info('Navigating to Dreams Summary page');
    await this.page.goto('dreams-total.html', { waitUntil: 'networkidle' });
    this.logger.info('Dreams Summary page loaded');
  }

  // Get a specific stat value by looking for the stat name in the first column
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

  // Extract all stats from the table and return them as an object
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

  // Get the page title from the h1 element
  async getPageTitle() {
    return (await this.pageTitle.textContent()).trim();
  }
}

module.exports = DreamSummaryPage;
