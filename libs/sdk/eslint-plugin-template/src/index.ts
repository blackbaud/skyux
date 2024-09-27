import { processors } from '@angular-eslint/eslint-plugin-template';

import next from './configs/next.json';
import recommended from './configs/recommended.json';
import {
  rule as noDeprecatedDirectives,
  RULE_NAME as noDeprecatedDirectivesRuleName,
} from './rules/no-deprecated-directives';
import {
  rule as noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from './rules/no-unbound-id';
import {
  rule as preferLabelText,
  RULE_NAME as preferLabelTextRuleName,
} from './rules/prefer-label-text';

export = {
  configs: {
    next,
    recommended,
  },
  processors,
  rules: {
    [noDeprecatedDirectivesRuleName]: noDeprecatedDirectives,
    [noUnboundIdRuleName]: noUnboundId,
    [preferLabelTextRuleName]: preferLabelText,
  },
};
