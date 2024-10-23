import type { TSESLint } from '@typescript-eslint/utils';

import {
  rule as noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from '../rules/no-lambda-imports';

const tsPlugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: 'skyux-eslint',
  },
  rules: {
    [noLambdaImportsRuleName]: noLambdaImports,
  },
};

export default tsPlugin;
