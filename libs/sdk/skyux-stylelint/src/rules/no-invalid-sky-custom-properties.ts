import stylelint, { Rule, RuleBase } from 'stylelint';

import { getRuleMeta } from '../utility/meta.js';
import { withNamespace } from '../utility/namespace.js';
import {
  deprecatedCustomPropsMap,
  validThemeCustomProperties,
} from '../utility/style-public-api.js';

const ruleId = 'no-invalid-sky-custom-properties';
export const ruleName = withNamespace(ruleId);

const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

const CUSTOM_PROPERTY_PATTERN = /var\(\s*(--sky-[a-z0-9-]+)[^)]*\)/g;

const messages = stylelint.utils.ruleMessages(ruleName, {
  deprecatedWithReplacement: (prop: string, replacement: string) =>
    `"${prop}" is deprecated. Use "${replacement}" instead.`,
  deprecatedNoReplacement: (prop: string) =>
    `"${prop}" is deprecated with no direct replacement. See the style API documentation: ${STYLE_API_DOCS_URL}`,
  unknownThemeCustomProperty: (prop: string) =>
    `"${prop}" is not a known --sky-theme- custom property. See the style API documentation for valid custom properties: ${STYLE_API_DOCS_URL}`,
  privateCustomProperty: (prop: string) =>
    `"${prop}" is a private SKY UX custom property and should not be used directly. To find an alternative, check the style API documentation: ${STYLE_API_DOCS_URL}`,
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

      CUSTOM_PROPERTY_PATTERN.lastIndex = 0;

      while ((match = CUSTOM_PROPERTY_PATTERN.exec(value)) !== null) {
        const prop = match[1];

        if (prop.startsWith('--sky-theme-')) {
          if (!validThemeCustomProperties.has(prop)) {
            stylelint.utils.report({
              result,
              ruleName,
              message: messages.unknownThemeCustomProperty(prop),
              node: decl,
            });
          }
          continue;
        }

        if (deprecatedCustomPropsMap.has(prop)) {
          const replacement = deprecatedCustomPropsMap.get(prop);
          if (replacement) {
            stylelint.utils.report({
              result,
              ruleName,
              message: messages.deprecatedWithReplacement(prop, replacement),
              node: decl,
              fix() {
                decl.value = decl.value.replace(prop, replacement);
              },
            });
          } else {
            stylelint.utils.report({
              result,
              ruleName,
              message: messages.deprecatedNoReplacement(prop),
              node: decl,
            });
          }
          continue;
        }

        stylelint.utils.report({
          result,
          ruleName,
          message: messages.privateCustomProperty(prop),
          node: decl,
        });
      }
    });
  };
};

const rule = ruleBase as Rule;

rule.messages = messages;
rule.meta = getRuleMeta({ fixable: true, ruleId });
rule.ruleName = ruleName;

export default stylelint.createPlugin(ruleName, rule);
