import { processors } from '@angular-eslint/eslint-plugin-template';

import next from './configs/next.json';
import recommended from './configs/recommended.json';
import templateNext from './configs/template-next.json';
import templateRecommended from './configs/template-recommended.json';
import {
  rule as noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from './rules/no-lambda-imports';
import {
  rule as noDeprecatedDirectives,
  RULE_NAME as noDeprecatedDirectivesRuleName,
} from './rules/template/no-deprecated-directives';
import {
  rule as noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './rules/template/no-unbound-id';

export = {
  configs: {
    next,
    recommended,
    ['template-next']: templateNext,
    ['template-recommended']: templateRecommended,
  },
  processors,
  rules: {
    [noLambdaImportsRuleName]: noLambdaImports,
    [`template/${noDeprecatedDirectivesRuleName}`]: noDeprecatedDirectives,
    [`template/${noUnboundIdRuleName}`]: noUnboundId,
  },
};
