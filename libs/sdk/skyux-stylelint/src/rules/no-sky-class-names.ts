import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';

const ruleId = 'no-sky-class-names';
export const ruleName = withNamespace(ruleId);

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: () => 'Do not reference .sky- classes in stylesheets',
});

const base: RuleBase = (options) => {
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

      if (!selector.includes('.sky-')) {
        return;
      }

      stylelint.utils.report({
        result,
        ruleName,
        message: messages.rejected(),
        node: ruleNode,
      });
    });
  };
};

const rule = base as Rule;
rule.messages = messages;
rule.meta = getRuleMeta({ ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
