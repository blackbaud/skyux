import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';

export default [
  tsBaseConfig,
  {
    name: 'skyux-eslint/ts-recommended',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
      'skyux-eslint/no-sky-selectors': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
