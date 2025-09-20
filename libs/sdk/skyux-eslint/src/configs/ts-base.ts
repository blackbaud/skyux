import type { TSESLint } from '@typescript-eslint/utils';

import tsPlugin from '../plugins/ts-plugin';

export default {
  name: 'skyux-eslint/ts-base',
  plugins: {
    'skyux-eslint': tsPlugin,
  },
} satisfies TSESLint.FlatConfig.Config;
