const { test, expect } = require('@playwright/test');
const DreamSummaryPage = require('../pages/DreamSummaryPage');
const DreamDiaryPage = require('../pages/DreamDiaryPage');
const TestData = require('../utils/testData');
const Logger = require('../utils/logger');

const logger = new Logger('DreamSummaryTests');

test.describe('Dream Portal - Dream Summary', () => {
  let summaryPage;

  test.beforeEach(async ({ page }) => {
    summaryPage = new DreamSummaryPage(page);
    await summaryPage.goto();
  });

  test('should display the correct page title', async () => {
    logger.step('Verifying summary page title');

    const title = await summaryPage.getPageTitle();
    expect(title).toBe('Dreams Summary');

    logger.info('Page title is correct: "Dreams Summary"');
  });

  test('should show Good Dreams count as 6', async () => {
    logger.step('Checking Good Dreams stat');

    const goodDreams = await summaryPage.getStatValue('Good Dreams');
    expect(goodDreams).toBe(String(TestData.expectedStats['Good Dreams']));

    logger.info(`Verified: Good Dreams = ${goodDreams}`);
  });

  test('should show Bad Dreams count as 4', async () => {
    logger.step('Checking Bad Dreams stat');

    const badDreams = await summaryPage.getStatValue('Bad Dreams');
    expect(badDreams).toBe(String(TestData.expectedStats['Bad Dreams']));

    logger.info(`Verified: Bad Dreams = ${badDreams}`);
  });

  test('should show Total Dreams count as 10', async () => {
    logger.step('Checking Total Dreams stat');

    const totalDreams = await summaryPage.getStatValue('Total Dreams');
    expect(totalDreams).toBe(String(TestData.expectedStats['Total Dreams']));

    logger.info(`Verified: Total Dreams = ${totalDreams}`);
  });

  test('should show Recurring Dreams count as 2', async () => {
    logger.step('Checking Recurring Dreams stat');

    const recurringDreams = await summaryPage.getStatValue('Recurring Dreams');
    expect(recurringDreams).toBe(
      String(TestData.expectedStats['Recurring Dreams'])
    );

    logger.info(`Verified: Recurring Dreams = ${recurringDreams}`);
  });

  test('should have all summary stats matching expected values', async () => {
    logger.step('Cross-checking all summary statistics');

    const stats = await summaryPage.getAllStats();

    Object.entries(TestData.expectedStats).forEach(([key, expectedValue]) => {
      expect(
        stats[key],
        `Stat "${key}" expected ${expectedValue} but got ${stats[key]}`
      ).toBe(expectedValue);
    });

    logger.info('All summary stats match expected values');
  });
});

test.describe('Dream Portal - Cross-Page Validation', () => {
  test('should identify "Flying over mountains" and "Lost in maze" as recurring dreams from diary data', async ({
    page,
  }) => {
    logger.step(
      'Cross-validating recurring dreams between Diary and Summary pages'
    );

    // Navigate to diary page and extract recurring dream names
    const diaryPage = new DreamDiaryPage(page);
    await diaryPage.goto();

    const recurringDreams = await diaryPage.getRecurringDreams();
    logger.info(`Recurring dreams from diary: ${recurringDreams.join(', ')}`);

    // Verify the expected recurring dream names are found
    TestData.expectedRecurringDreams.forEach((expectedDream) => {
      expect(
        recurringDreams.includes(expectedDream),
        `Expected "${expectedDream}" to be a recurring dream, but it wasn't found. Found: ${recurringDreams.join(', ')}`
      ).toBeTruthy();
    });

    // Verify count matches the summary page
    const summaryPage = new DreamSummaryPage(page);
    await summaryPage.goto();

    const recurringCount = await summaryPage.getStatValue('Recurring Dreams');
    expect(parseInt(recurringCount)).toBe(recurringDreams.length);

    logger.info(
      `Cross-validation passed: ${recurringDreams.length} recurring dreams match summary page count of ${recurringCount}`
    );
  });
});
