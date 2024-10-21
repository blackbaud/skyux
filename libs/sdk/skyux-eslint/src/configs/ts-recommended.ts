import type { TSESLint } from '@typescript-eslint/utils';

import { tsBaseConfig } from './ts-base';

export default {
  ...tsBaseConfig(),
  name: 'skyux-eslint/ts-all',
  rules: {
    'skyux-eslint/no-lambda-imports': 'error',
  },
} satisfies TSESLint.FlatConfig.Config;
