import type { TSESLint } from '@typescript-eslint/utils';

import templateBaseConfig from './template-base';

export default [
  templateBaseConfig,
  {
    name: 'skyux-eslint-template-recommended',
    rules: {
      'skyux-eslint-template/no-deprecated-classnames': 'error',
      'skyux-eslint-template/no-deprecated-directives': 'error',
      'skyux-eslint-template/no-invalid-input-box-children': 'error',
      'skyux-eslint-template/no-invalid-input-types': 'error',
      'skyux-eslint-template/no-legacy-icons': 'error',
      'skyux-eslint-template/no-radio-group-with-nested-list': 'error',
      'skyux-eslint-template/no-unbound-id': 'error',
      'skyux-eslint-template/prefer-disabled-attr': 'error',
      'skyux-eslint-template/prefer-form-control-component': 'error',
      'skyux-eslint-template/prefer-input-box': 'error',
      'skyux-eslint-template/prefer-input-box-for-sky-components': 'error',
      'skyux-eslint-template/prefer-label-text': 'error',
    },
  },
] satisfies TSESLint.FlatConfig.ConfigArray;
