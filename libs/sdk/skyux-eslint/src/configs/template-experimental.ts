import type { TSESLint } from '@typescript-eslint/utils';

import templateBaseConfig from './template-base';

export default [
  templateBaseConfig,
  {
    name: 'skyux-eslint-template-experimental',
    rules: {
      'skyux-eslint-template/no-invalid-sky-classnames': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
