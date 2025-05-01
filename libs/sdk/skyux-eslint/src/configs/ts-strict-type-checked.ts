import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';
import tsStrictBaseConfig from './ts-strict-base';
import tsStrictBaseTypeCheckedConfig from './ts-strict-base-type-checked';

export default [
  tsBaseConfig,
  tsStrictBaseConfig,
  tsStrictBaseTypeCheckedConfig,
  {
    name: 'skyux-eslint/ts-strict-type-checked',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
