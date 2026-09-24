// Test data and expected values for all Dream Portal tests
// Keeping this separate from test logic makes it easier to maintain

const TestData = {
  // All the URLs we need to test
  urls: {
    home: './',
    dreamDiary: 'dreams-diary.html',
    dreamSummary: 'dreams-total.html',
  },

  // We expect to find exactly 10 dream entries
  expectedDreamCount: 10,

  // Only these two types are valid for dreams
  validDreamTypes: ['Good', 'Bad'],

  // Expected summary statistics
  expectedStats: {
    'Good Dreams': 6,
    'Bad Dreams': 4,
    'Total Dreams': 10,
    'Recurring Dreams': 2,
    'Dreams This Week': 7,
  },

  // Dreams that appear more than once
  expectedRecurringDreams: ['Flying over mountains', 'Lost in maze'],

  // Expected columns in the dream diary table
  expectedDiaryColumns: ['Dream Name', 'Days Ago', 'Dream Type'],

  // Loading animation should disappear after about 3 seconds
  loadingTimeout: 3000,

  // All the dream entries we expect to find in order
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
