import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';
import tsBaseConfigTypeChecked from './ts-base-type-checked';

export default [
  tsBaseConfig,
  tsBaseConfigTypeChecked,
  {
    name: 'skyux-eslint/ts-recommended',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
