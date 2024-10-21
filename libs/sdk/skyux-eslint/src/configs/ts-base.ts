import type { TSESLint } from '@typescript-eslint/utils';

import tsPlugin from '../plugins/ts-plugin';

export function tsBaseConfig(): TSESLint.FlatConfig.Config {
  return {
    plugins: {
      'skyux-eslint': tsPlugin,
    },
  };
}
