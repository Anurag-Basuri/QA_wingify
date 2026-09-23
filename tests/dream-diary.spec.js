const { test, expect } = require('@playwright/test');
const DreamDiaryPage = require('../pages/DreamDiaryPage');
const TestData = require('../utils/testData');
const Logger = require('../utils/logger');

const logger = new Logger('DreamDiaryTests');

test.describe('Dream Portal - Dream Diary', () => {
  let diaryPage;

  test.beforeEach(async ({ page }) => {
    diaryPage = new DreamDiaryPage(page);
    await diaryPage.goto();
  });

  test('should have exactly 10 dream entries in the table', async () => {
    logger.step('Counting dream entries in the diary table');

    const dreamCount = await diaryPage.getDreamCount();
    expect(dreamCount).toBe(TestData.expectedDreamCount);

    logger.info(`Verified: Table contains exactly ${dreamCount} dream entries`);
  });

  test('should only contain "Good" or "Bad" as dream types', async () => {
    logger.step('Validating that all dream types are either "Good" or "Bad"');

    const dreamTypes = await diaryPage.getDreamTypes();

    dreamTypes.forEach((type, index) => {
      expect(
        TestData.validDreamTypes.includes(type),
        `Row ${index + 1}: Expected dream type to be "Good" or "Bad", but got "${type}"`
      ).toBeTruthy();
    });

    logger.info(`Verified: All ${dreamTypes.length} entries have valid dream types`);
  });

  test('should have all three columns filled for each row', async () => {
    logger.step('Checking that every row has all three columns populated');

    const entries = await diaryPage.getDreamEntries();

    entries.forEach((entry, index) => {
      expect(
        entry.name.length,
        `Row ${index + 1}: Dream Name is empty`
      ).toBeGreaterThan(0);

      expect(
        entry.daysAgo.length,
        `Row ${index + 1}: Days Ago is empty`
      ).toBeGreaterThan(0);

      expect(
        entry.type.length,
        `Row ${index + 1}: Dream Type is empty`
      ).toBeGreaterThan(0);
    });

    logger.info(`Verified: All ${entries.length} rows have all 3 columns filled`);
  });

  test('should display correct table headers', async () => {
    logger.step('Verifying table column headers');

    const headers = await diaryPage.getTableHeaders();

    expect(headers).toEqual(TestData.expectedDiaryColumns);
    logger.info(`Verified: Table headers are ${headers.join(', ')}`);
  });

  test('should contain expected dream entries with correct data', async () => {
    logger.step('Verifying all dream entries match expected data');

    const entries = await diaryPage.getDreamEntries();

    entries.forEach((entry, index) => {
      const expected = TestData.expectedDreamEntries[index];

      expect(entry.name).toBe(expected.name);
      expect(entry.daysAgo).toBe(expected.daysAgo);
      expect(entry.type).toBe(expected.type);
    });

    logger.info('Verified: All dream entries match expected data exactly');
  });
});
