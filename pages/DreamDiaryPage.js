const Logger = require('../utils/logger');

// Page Object Model for the Dreams Diary page (dreams-diary.html)
// Handles all interactions with the dream log table and data extraction
class DreamDiaryPage {
  // Takes a Playwright page instance and sets up locators for the table elements
  constructor(page) {
    this.page = page;
    this.logger = new Logger('DreamDiaryPage');

    // Set up all the locators we'll need to interact with the table
    this.dreamTable = page.locator('#dreamsDiary');
    this.tableRows = page.locator('#dreamsDiary tbody tr');
    this.tableHeaders = page.locator('#dreamsDiary thead th');
    this.pageTitle = page.locator('h1');
  }

  // Navigate to the Dreams Diary page and wait for it to load
  async goto() {
    this.logger.info('Navigating to Dreams Diary page');
    await this.page.goto('dreams-diary.html', { waitUntil: 'networkidle' });
    this.logger.info('Dreams Diary page loaded');
  }

  // Count how many dream entries are currently in the table
  async getDreamCount() {
    const count = await this.tableRows.count();
    this.logger.info(`Found ${count} dream entries`);
    return count;
  }

  // Get all dream entries from the table and return them as structured objects
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

  // Pull out just the dream types from all entries (Good, Bad, etc.)
  async getDreamTypes() {
    const entries = await this.getDreamEntries();
    return entries.map((entry) => entry.type);
  }

  // Pull out just the dream names from all entries
  async getDreamNames() {
    const entries = await this.getDreamEntries();
    return entries.map((entry) => entry.name);
  }

  // Find dreams that appear more than once in the table
  async getRecurringDreams() {
    const names = await this.getDreamNames();
    const nameCount = {};

    // Count how many times each dream name shows up
    names.forEach((name) => {
      nameCount[name] = (nameCount[name] || 0) + 1;
    });

    // Keep only the names that appear more than once
    const recurring = Object.keys(nameCount).filter(
      (name) => nameCount[name] > 1
    );

    this.logger.info(`Found ${recurring.length} recurring dreams: ${recurring.join(', ')}`);
    return recurring;
  }

  // Get the column headers from the table
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
