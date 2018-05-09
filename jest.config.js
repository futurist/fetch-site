module.exports = {
  verbose: true,
  testPathIgnorePatterns: [
    'node_modules',
    'fixtures',
    'coverage',
    'tmp',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js',
  ],
  coverageDirectory: '__tests__/coverage',
}

