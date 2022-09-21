/* eslint-disable */
export default {
  displayName: 'e2e-schematics',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '../../../coverage/libs/sdk/e2e-schematics',
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 100,
      lines: 99,
      statements: 99,
    },
  },
  silent: true,
  maxConcurrency: 2,
  maxWorkers: 2,
  testTimeout: 120000,
};
