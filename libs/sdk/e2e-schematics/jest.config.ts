export default {
  displayName: 'e2e-schematics',
  preset: '../../../jest.preset.js',
  setupFiles: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        useESM: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '../../../coverage/libs/sdk/e2e-schematics',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  silent: true,
  maxConcurrency: 2,
  maxWorkers: 2,
  testTimeout: 120000,
};
