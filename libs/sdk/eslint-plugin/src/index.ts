import all from './configs/all.json';
import templateAll from './configs/template-all.json';
import processors from './processors';
import {
  noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from './rules/no-lambda-imports';
import {
  noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './rules/template/no-unbound-id';

export = {
  configs: {
    all,
    ['template-all']: templateAll,
  },
  processors,
  rules: {
    [noLambdaImportsRuleName]: noLambdaImports,
    [`template/${noUnboundIdRuleName}`]: noUnboundId,
  },
};
