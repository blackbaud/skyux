import { processors } from '@angular-eslint/eslint-plugin-template';
import type { TSESLint } from '@typescript-eslint/utils';

import {
  rule as noDeprecatedDirectives,
  RULE_NAME as noDeprecatedDirectivesRuleName,
} from '../rules/template/no-deprecated-directives';
import {
  rule as noUnboundId,
  RULE_NAME as noUnboundIdRuleName,
} from '../rules/template/no-unbound-id';
import {
  rule as preferLabelText,
  RULE_NAME as preferLabelTextRuleName,
} from '../rules/template/prefer-label-text';

export default {
  meta: {
    name: 'skyux-eslint-template',
  },
  processors,
  rules: {
    [noDeprecatedDirectivesRuleName]: noDeprecatedDirectives,
    [noUnboundIdRuleName]: noUnboundId,
    [preferLabelTextRuleName]: preferLabelText,
  },
} satisfies TSESLint.FlatConfig.Plugin;
