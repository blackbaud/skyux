import stylelint, { Rule, RuleBase } from 'stylelint';

const ruleId = 'no-sky-class-names';
export const ruleName = `skyux-stylelint/${ruleId}`;

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: () => 'Do not reference .sky- classes in stylesheets',
});

const meta = {
  url: `https://github.com/blackbaud/skyux/blob/main/libs/cdk/skyux-stylelint/docs/rules/${ruleId}.md`,
};

const rule: RuleBase = (primary) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
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
        word: selector,
      });
    });
  };
};

(rule as Rule).messages = messages;
(rule as Rule).meta = meta;
(rule as Rule).ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule as Rule);
