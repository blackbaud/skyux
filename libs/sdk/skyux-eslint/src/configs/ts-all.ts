import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';
import tsRecommendedTypeChecked from './ts-base-type-checked';

export default [
  tsBaseConfig,
  tsRecommendedTypeChecked,
  {
    name: 'skyux-eslint/ts-all',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
