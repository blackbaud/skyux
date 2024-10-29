import type { TSESLint } from '@typescript-eslint/utils';

import templatePlugin from '../plugins/template-plugin';

export default {
  plugins: {
    'skyux-eslint-template': templatePlugin,
  },
} satisfies TSESLint.FlatConfig.Config;
