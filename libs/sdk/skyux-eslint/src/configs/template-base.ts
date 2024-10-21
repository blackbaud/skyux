import type { TSESLint } from '@typescript-eslint/utils';

import templatePlugin from '../plugins/template-plugin';

export function templateBaseConfig(): TSESLint.FlatConfig.Config {
  return {
    plugins: {
      'skyux-eslint-template': templatePlugin,
    },
  };
}
