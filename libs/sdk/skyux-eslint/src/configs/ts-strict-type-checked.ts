import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';
import tsStrictBase from './ts-strict-base';
import tsStrictBaseTypeChecked from './ts-strict-base-type-checked';

export default [
  tsBaseConfig,
  tsStrictBase,
  tsStrictBaseTypeChecked,
  {
    name: 'skyux-eslint/ts-strict-type-checked',
    rules: {
      'skyux-eslint/no-lambda-imports': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
