export default {
  displayName: 'sdk-testing',
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.schematics-spec.json',
        diagnostics: false,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^ora$': '<rootDir>/schematics/__mocks__/ora.ts',
  },
  testMatch: ['<rootDir>/schematics/**/*.spec.ts'],
  coverageDirectory: '../../../coverage/libs/sdk/testing/schematics',
  coveragePathIgnorePatterns: ['<rootDir>/schematics/testing'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: '../../../jest.preset.js',
};
