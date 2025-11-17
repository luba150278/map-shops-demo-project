export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'json'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  verbose: true,
};
