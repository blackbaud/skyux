import type { TSESLint } from '@typescript-eslint/utils';

import templateBaseConfig from './template-base';

export default [
  templateBaseConfig,
  {
    name: 'skyux-eslint-template-all',
    rules: {
      'skyux-eslint-template/no-deprecated-classnames': 'error',
      'skyux-eslint-template/no-deprecated-directives': 'error',
      'skyux-eslint-template/no-legacy-icons': 'error',
      'skyux-eslint-template/no-radio-group-with-nested-list': 'error',
      'skyux-eslint-template/prefer-disabled-attr': 'error',
      'skyux-eslint-template/no-unbound-id': 'error',
      'skyux-eslint-template/prefer-disabled-attr': 'error',
      'skyux-eslint-template/prefer-label-text': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
