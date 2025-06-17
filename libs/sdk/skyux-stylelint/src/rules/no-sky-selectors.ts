import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';

const ruleId = 'no-sky-selectors';
export const ruleName = withNamespace(ruleId);

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: () =>
    'Do not reference SKY UX classes, IDs, or components in stylesheets',
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

      // Disallow classes, IDs, or components starting with sky-, skyux-, or skypages-
      if (/(^|[.#\s])sky(pages|ux)?-/g.exec(selector)) {
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
