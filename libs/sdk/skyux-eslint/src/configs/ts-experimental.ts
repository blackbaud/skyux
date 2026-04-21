import type { TSESLint } from '@typescript-eslint/utils';

import tsBaseConfig from './ts-base';

export default [
  tsBaseConfig,
  {
    name: 'skyux-eslint/ts-experimental',
    rules: {
      'skyux-eslint/no-invalid-sky-classnames': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
