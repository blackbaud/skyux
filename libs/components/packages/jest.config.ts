export default {
  displayName: 'components-packages',
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
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/components/packages',
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
