import type { TSESLint } from '@typescript-eslint/utils';

import {
  rule as noInvalidSkyClassnames,
  RULE_NAME as noInvalidSkyClassnamesRuleName,
} from '../rules/no-invalid-sky-classnames';
import {
  rule as noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from '../rules/no-lambda-imports';
import {
  rule as noSkySelectors,
  RULE_NAME as noSkySelectorsRuleName,
} from '../rules/no-sky-selectors';

const tsPlugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: 'skyux-eslint',
  },
  rules: {
    [noInvalidSkyClassnamesRuleName]: noInvalidSkyClassnames,
    [noLambdaImportsRuleName]: noLambdaImports,
    [noSkySelectorsRuleName]: noSkySelectors,
  },
};

export default tsPlugin;
