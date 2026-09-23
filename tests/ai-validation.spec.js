const { test, expect } = require('@playwright/test');
const DreamDiaryPage = require('../pages/DreamDiaryPage');
const AIClassifier = require('../utils/aiClassifier');
const Logger = require('../utils/logger');

const logger = new Logger('AIValidationTests');

test.describe('Dream Portal - AI-Based Validation (Bonus)', () => {
  // AI API calls may take longer, especially with cold starts
  test.setTimeout(60000);

  let diaryPage;
  let classifier;

  test.beforeEach(async ({ page }) => {
    diaryPage = new DreamDiaryPage(page);
    classifier = new AIClassifier();
    await diaryPage.goto();
  });

  test('should classify dream names using AI and match table data', async () => {
    logger.step(
      'Classifying all dream entries using AI and comparing with table data'
    );

    const entries = await diaryPage.getDreamEntries();
    let matchCount = 0;
    let mismatchCount = 0;
    const results = [];

    for (const entry of entries) {
      const aiResult = await classifier.classifyDream(entry.name);

      const isMatch = aiResult.classification === entry.type;
      if (isMatch) matchCount++;
      else mismatchCount++;

      results.push({
        dreamName: entry.name,
        tableType: entry.type,
        aiClassification: aiResult.classification,
        confidence: `${(aiResult.confidence * 100).toFixed(1)}%`,
        method: aiResult.method,
        match: isMatch ? '✅' : '❌',
      });

      logger.info(
        `"${entry.name}" → Table: ${entry.type}, AI: ${aiResult.classification} (${(aiResult.confidence * 100).toFixed(1)}%) ${isMatch ? '✅' : '❌'}`
      );
    }

    // Log summary
    console.table(results);
    logger.info(
      `AI Classification Results: ${matchCount}/${entries.length} matched (${mismatchCount} mismatches)`
    );

    // We expect a reasonable match rate (at least 70% accuracy)
    // AI classification might not match 100% due to subjective interpretation
    const accuracy = matchCount / entries.length;
    expect(
      accuracy,
      `AI accuracy is ${(accuracy * 100).toFixed(1)}%, expected at least 70%`
    ).toBeGreaterThanOrEqual(0.7);
  });

  test('should correctly classify "Monster chase" as a Bad dream', async () => {
    logger.step('Testing specific classification: "Monster chase" → Bad');

    const result = await classifier.classifyDream('Monster chase');

    expect(result.classification).toBe('Bad');
    logger.info(
      `"Monster chase" correctly classified as "${result.classification}" via ${result.method} (confidence: ${(result.confidence * 100).toFixed(1)}%)`
    );
  });

  test('should correctly classify "Flying over mountains" as a Good dream', async () => {
    logger.step(
      'Testing specific classification: "Flying over mountains" → Good'
    );

    const result = await classifier.classifyDream('Flying over mountains');

    expect(result.classification).toBe('Good');
    logger.info(
      `"Flying over mountains" correctly classified as "${result.classification}" via ${result.method} (confidence: ${(result.confidence * 100).toFixed(1)}%)`
    );
  });
});
