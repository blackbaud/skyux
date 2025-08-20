import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';

const ruleId = 'no-sky-theme-imports';
export const ruleName = withNamespace(ruleId);

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (path: string): string =>
    `Direct imports from "${path}" are not allowed. ` +
    'Only "@skyux/theme/scss/responsive-container" is permitted for direct import.',
});

/**
 * Detects disallowed imports from '@skyux/theme/scss/*' paths.
 * Only allows '@skyux/theme/scss/responsive-container' for direct import.
 */
const ruleBase: RuleBase = (options) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: options,
      possible: [true],
    });

    if (!validOptions) {
      return;
    }

    root.walkAtRules((atRule) => {
      if (!['import', 'use', 'forward'].includes(atRule.name)) {
        return;
      }

      const params = atRule.params.trim();
      // Remove quotes and extract the path
      const pathMatch = params.match(
        /['"]([^'"]*@skyux\/theme\/scss\/[^'"]*)['"]/,
      );

      if (pathMatch) {
        const importPath = pathMatch[1];

        const allowedPaths = [
          '@skyux/theme/scss/responsive-container.scss',
          '@skyux/theme/scss/responsive-container',
        ];

        if (!allowedPaths.includes(importPath)) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.rejected(importPath),
            node: atRule,
          });
        }
      }
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
