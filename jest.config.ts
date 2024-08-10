// jest.config.js
module.exports = {
  testMatch: ['**/tests/**/*.test.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json']
};