import type { TSESLint } from '@typescript-eslint/utils';

import tsBase from './ts-base';

export default [
  tsBase,
  {
    name: 'skyux-eslint/ts-recommended',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
