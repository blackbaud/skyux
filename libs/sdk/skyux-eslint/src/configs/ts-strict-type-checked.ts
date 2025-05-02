import type { TSESLint } from '@typescript-eslint/utils';

import tsRecommendedConfig from './ts-recommended';
import tsStrictBaseConfig from './ts-strict-base';
import tsStrictBaseTypeCheckedConfig from './ts-strict-base-type-checked';

export default [
  ...tsRecommendedConfig,
  tsStrictBaseConfig,
  tsStrictBaseTypeCheckedConfig,
  {
    name: 'skyux-eslint/ts-strict-type-checked',
    rules: {},
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
