import type { TSESLint } from '@typescript-eslint/utils';

export default (
  plugin: TSESLint.FlatConfig.Plugin,
): TSESLint.FlatConfig.ConfigArray => {
  const tsBaseConfig = {
    name: 'skyux-eslint/ts-base',
    plugins: {
      'skyux-eslint': plugin,
    },
  };

  return [
    tsBaseConfig,
    {
      name: 'skyux-eslint/ts-all',
      rules: {
        'skyux-eslint/no-lambda-imports': ['error'],
      },
    },
  ];
};
