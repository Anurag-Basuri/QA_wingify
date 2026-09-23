/**
 * Centralized test data and expected values for Dream Portal tests.
 * Keeping test data separate from test logic for maintainability.
 */

const TestData = {
  // URLs
  urls: {
    home: './',
    dreamDiary: 'dreams-diary.html',
    dreamSummary: 'dreams-total.html',
  },

  // Expected dream count
  expectedDreamCount: 10,

  // Valid dream types
  validDreamTypes: ['Good', 'Bad'],

  // Expected summary stats
  expectedStats: {
    'Good Dreams': 6,
    'Bad Dreams': 4,
    'Total Dreams': 10,
    'Recurring Dreams': 2,
    'Dreams This Week': 7,
  },

  // Expected recurring dream names
  expectedRecurringDreams: ['Flying over mountains', 'Lost in maze'],

  // Expected table columns for dream diary
  expectedDiaryColumns: ['Dream Name', 'Days Ago', 'Dream Type'],

  // Loading animation timeout in milliseconds
  loadingTimeout: 3000,

  // All expected dream entries (for comprehensive validation)
  expectedDreamEntries: [
    { name: 'Flying over mountains', daysAgo: '1 day ago', type: 'Good' },
    { name: 'Lost in maze', daysAgo: '2 days ago', type: 'Bad' },
    { name: 'Flying over mountains', daysAgo: '3 days ago', type: 'Good' },
    { name: 'Winning lottery', daysAgo: '4 days ago', type: 'Good' },
    { name: 'Being late to exam', daysAgo: '5 days ago', type: 'Bad' },
    { name: 'Lost in maze', daysAgo: '6 days ago', type: 'Bad' },
    { name: 'Swimming with dolphins', daysAgo: '7 days ago', type: 'Good' },
    { name: 'Flying over mountains', daysAgo: '8 days ago', type: 'Good' },
    { name: 'Time travel adventure', daysAgo: '9 days ago', type: 'Good' },
    { name: 'Monster chase', daysAgo: '10 days ago', type: 'Bad' },
  ],
};

module.exports = TestData;
