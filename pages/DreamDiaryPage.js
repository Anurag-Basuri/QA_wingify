const Logger = require('../utils/logger');

/**
 * Page Object Model for the Dreams Diary Page (dreams-diary.html).
 * Handles dream log table interactions and data extraction.
 */
class DreamDiaryPage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page instance
   */
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DreamDiaryPage');

    // Locators
    this.dreamTable = page.locator('#dreamsDiary');
    this.tableRows = page.locator('#dreamsDiary tbody tr');
    this.tableHeaders = page.locator('#dreamsDiary thead th');
    this.pageTitle = page.locator('h1');
  }

  /**
   * Navigate to the Dreams Diary page.
   */
  async goto() {
    this.logger.info('Navigating to Dreams Diary page');
    await this.page.goto('dreams-diary.html', { waitUntil: 'networkidle' });
    this.logger.info('Dreams Diary page loaded');
  }



  /**
   * Get the total number of dream entries in the table.
   * @returns {Promise<number>} Count of dream rows
   */
  async getDreamCount() {
    const count = await this.tableRows.count();
    this.logger.info(`Found ${count} dream entries`);
    return count;
  }

  /**
   * Extract all dream entries from the table.
   * @returns {Promise<Array<{name: string, daysAgo: string, type: string}>>}
   */
  async getDreamEntries() {
    const rows = await this.tableRows.all();
    const entries = [];

    for (const row of rows) {
      const cells = await row.locator('td').all();
      const entry = {
        name: (await cells[0].textContent()).trim(),
        daysAgo: (await cells[1].textContent()).trim(),
        type: (await cells[2].textContent()).trim(),
      };
      entries.push(entry);
    }

    this.logger.info(`Extracted ${entries.length} dream entries`);
    return entries;
  }

  /**
   * Get all dream types from the table.
   * @returns {Promise<string[]>} Array of dream types (e.g., ["Good", "Bad", ...])
   */
  async getDreamTypes() {
    const entries = await this.getDreamEntries();
    return entries.map((entry) => entry.type);
  }

  /**
   * Get all dream names from the table.
   * @returns {Promise<string[]>} Array of dream names
   */
  async getDreamNames() {
    const entries = await this.getDreamEntries();
    return entries.map((entry) => entry.name);
  }

  /**
   * Find recurring dreams (names that appear more than once).
   * @returns {Promise<string[]>} Array of recurring dream names
   */
  async getRecurringDreams() {
    const names = await this.getDreamNames();
    const nameCount = {};

    // Count occurrences of each dream name
    names.forEach((name) => {
      nameCount[name] = (nameCount[name] || 0) + 1;
    });

    // Filter names that appear more than once
    const recurring = Object.keys(nameCount).filter(
      (name) => nameCount[name] > 1
    );

    this.logger.info(`Found ${recurring.length} recurring dreams: ${recurring.join(', ')}`);
    return recurring;
  }

  /**
   * Get the table column headers.
   * @returns {Promise<string[]>} Array of header texts
   */
  async getTableHeaders() {
    const headers = await this.tableHeaders.all();
    const headerTexts = [];

    for (const header of headers) {
      headerTexts.push((await header.textContent()).trim());
    }

    return headerTexts;
  }
}

module.exports = DreamDiaryPage;
