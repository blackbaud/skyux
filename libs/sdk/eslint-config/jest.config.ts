export default {
  displayName: 'sdk-eslint-config',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/sdk/eslint-config',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/schematics/shared/testing',
    '<rootDir>/src/schematics/shared/utility',
  ],
  preset: '../../../jest.preset.js',
  maxConcurrency: 2,
  maxWorkers: 2,
  testTimeout: 120000,
};
