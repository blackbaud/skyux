import next from './configs/next.json';
import recommended from './configs/recommended.json';
import {
  rule as noLambdaImports,
  RULE_NAME as noLambdaImportsRuleName,
} from './rules/no-lambda-imports';

export = {
  configs: {
    next,
    recommended,
  },
  rules: {
    [noLambdaImportsRuleName]: noLambdaImports,
  },
};
