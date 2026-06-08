import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';
import { deprecatedScssVarMap } from '../utility/style-public-api.js';

const ruleId = 'no-deprecated-sky-scss-variables';
export const ruleName = withNamespace(ruleId);

const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

const SCSS_VAR_PATTERN = /\$sky-[a-z0-9-]+/g;

const messages = stylelint.utils.ruleMessages(ruleName, {
  deprecatedWithReplacement: (variable: string, replacement: string) =>
    `"${variable}" is deprecated. Use "var(${replacement})" instead.`,
  deprecatedNoReplacement: (variable: string) =>
    `"${variable}" is deprecated with no direct replacement. See the style API documentation: ${STYLE_API_DOCS_URL}`,
  privateVariable: (variable: string) =>
    `"${variable}" is a private or obsolete SKY UX SCSS variable. To find an alternative, see the style API documentation: ${STYLE_API_DOCS_URL}`,
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

    root.walkDecls((decl) => {
      const { value } = decl;
      let match: RegExpExecArray | null;

      SCSS_VAR_PATTERN.lastIndex = 0;

      while ((match = SCSS_VAR_PATTERN.exec(value)) !== null) {
        const variable = match[0];

        if (!deprecatedScssVarMap.has(variable)) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.privateVariable(variable),
            node: decl,
          });
          continue;
        }

        const replacement = deprecatedScssVarMap.get(variable);

        if (replacement) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.deprecatedWithReplacement(variable, replacement),
            node: decl,
            fix() {
              decl.value = decl.value.replace(variable, `var(${replacement})`);
            },
          });
        } else {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.deprecatedNoReplacement(variable),
            node: decl,
          });
        }
      }
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ fixable: true, ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
