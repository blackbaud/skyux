import next from './configs/next.json';
import templateNext from './configs/template-next.json';
import processors from './processors';
import {
  noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from './rules/no-lambda-imports';
import {
  rule as noDeprecatedDirectives,
  RULE_NAME as noDeprecatedDirectivesRuleName,
} from './rules/template/no-deprecated-directives';
import {
  noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './rules/template/no-unbound-id';

export = {
  configs: {
    next,
    ['template-next']: templateNext,
  },
  processors,
  rules: {
    [noLambdaImportsRuleName]: noLambdaImports,
    [noDeprecatedDirectivesRuleName]: noDeprecatedDirectives,
    [noUnboundIdRuleName]: noUnboundId,
  },
};
