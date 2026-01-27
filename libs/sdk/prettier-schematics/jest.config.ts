export default {
  displayName: 'sdk-prettier-schematics',

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
  moduleNameMapper: {
    '^ora$': '<rootDir>/__mocks__/ora.ts',
  },
  coverageDirectory: '../../../coverage/libs/sdk/prettier-schematics',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/src/schematics/testing',
    '<rootDir>/src/schematics/utility',
  ],
  preset: '../../../jest.preset.js',
};
