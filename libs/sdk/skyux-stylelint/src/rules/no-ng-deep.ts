import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';

const ruleId = 'no-ng-deep';
export const ruleName = withNamespace(ruleId);

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: () =>
    'Unexpected usage of "::ng-deep". The Angular team strongly discourages ' +
    'new use of ::ng-deep as it breaks component encapsulation. Consider ' +
    'using :host or component communication patterns instead.',
});

const ruleBase: RuleBase = (options) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: options,
      possible: [true],
    });

    if (!validOptions) {
      return;
    }

    root.walkRules((ruleNode) => {
      const { selector } = ruleNode;

      // Check for ::ng-deep in selectors (case-insensitive)
      // Matches ::ng-deep, : :ng-deep (with space), and variations
      if (/::?\s*ng-deep/i.test(selector)) {
        stylelint.utils.report({
          result,
          ruleName,
          message: messages.rejected(),
          node: ruleNode,
        });
      }
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
