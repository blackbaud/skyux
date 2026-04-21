import type {
  TmplAstElement,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';
import {
  WHITELISTED_SKY_CLASSES,
  deprecatedStyleClassMap,
  validPublicClassNames,
} from '../utils/style-public-api';

export const RULE_NAME = 'no-invalid-sky-classnames';

const STYLE_API_DOCS_URL =
  'https://developer.blackbaud.com/skyux/design/styles';

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    function checkClassName(
      className: string,
      loc: ReturnType<typeof parserServices.convertNodeSourceSpanToLoc>,
      getDeprecatedWithReplacementFix: (replacement: string) => RuleFix[],
    ): void {
      if (className.startsWith('sky-theme-')) {
        if (!validPublicClassNames.has(className)) {
          context.report({
            loc,
            messageId: 'unknownThemeClass',
            data: { className },
          });
        }
        return;
      }

      if (deprecatedStyleClassMap.has(className)) {
        const replacement = deprecatedStyleClassMap.get(className);
        if (replacement) {
          context.report({
            loc,
            messageId: 'deprecatedWithReplacement',
            data: { className, replacement },
            fix: () => getDeprecatedWithReplacementFix(replacement),
          });
        } else {
          context.report({
            loc,
            messageId: 'deprecatedNoReplacement',
            data: { className, docsUrl: STYLE_API_DOCS_URL },
          });
        }
        return;
      }

      if (WHITELISTED_SKY_CLASSES.has(className)) {
        return;
      }

      context.report({ loc, messageId: 'privateClass', data: { className } });
    }

    return {
      [`Element > :matches(TextAttribute)[name="class"]`](
        attr: TmplAstTextAttribute,
      ): void {
        const classNames = attr.value.split(/\s+/).filter(Boolean);
        const fixedClassNames = [...classNames];

        for (const className of classNames) {
          if (!className.startsWith('sky-')) {
            continue;
          }

          const loc = parserServices.convertNodeSourceSpanToLoc(
            attr.sourceSpan,
          );

          checkClassName(className, loc, (replacement) => {
            const index = fixedClassNames.indexOf(className);
            if (index > -1) {
              fixedClassNames[index] = replacement;
            }
            if (!attr.valueSpan) {
              return [];
            }
            return [
              {
                range: [attr.valueSpan.start.offset, attr.valueSpan.end.offset],
                text: fixedClassNames.join(' '),
              },
            ];
          });
        }
      },
      Element(element: TmplAstElement): void {
        for (const attr of element.inputs) {
          if (!attr.name.startsWith('sky-')) {
            continue;
          }

          const loc = parserServices.convertNodeSourceSpanToLoc(
            attr.sourceSpan,
          );

          checkClassName(attr.name, loc, (replacement) => {
            if (!attr.keySpan) {
              return [];
            }
            return [
              {
                range: [
                  attr.keySpan.end.offset - attr.name.length,
                  attr.keySpan.end.offset,
                ],
                text: replacement,
              },
            ];
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Validates sky- CSS class usage against the SKY UX style public API.',
    },
    messages: {
      deprecatedWithReplacement:
        '"{{className}}" is deprecated. Use "{{replacement}}" instead.',
      deprecatedNoReplacement:
        '"{{className}}" is deprecated with no direct replacement. See the style API documentation: {{docsUrl}}',
      unknownThemeClass: `"{{className}}" is not a known sky-theme- class. See the style API documentation for valid class names: ${STYLE_API_DOCS_URL}`,
      privateClass: `"{{className}}" is a private SKY UX class and should not be used directly. See the style API documentation for alternatives: ${STYLE_API_DOCS_URL}`,
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
