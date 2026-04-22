export default {
  displayName: 'sdk-testing-schematics',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        diagnostics: false,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^ora$': '<rootDir>/__mocks__/ora.ts',
    '@skyux-sdk/testing/package.json': '<rootDir>/../testing/package.json',
  },
  coverageDirectory: '../../../coverage/libs/sdk/testing-schematics',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coveragePathIgnorePatterns: ['<rootDir>/src/schematics/testing'],
  preset: '../../../jest.preset.js',
};
