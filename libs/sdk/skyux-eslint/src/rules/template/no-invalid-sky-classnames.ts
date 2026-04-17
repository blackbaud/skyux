import type { TmplAstTextAttribute } from '@angular-eslint/bundled-angular-compiler';
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

    return {
      [`Element > :matches(TextAttribute)[name="class"]`](
        attr: TmplAstTextAttribute,
      ): void {
        const classNames = attr.value.split(/\s+/).filter(Boolean);
        const fixedClassNames = [...classNames];

        for (const className of classNames) {
          if (className.startsWith('sky-theme-')) {
            if (!validPublicClassNames.has(className)) {
              context.report({
                loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
                messageId: 'unknownThemeClass',
                data: { className },
              });
            }
            continue;
          }

          if (!className.startsWith('sky-')) {
            continue;
          }

          if (deprecatedStyleClassMap.has(className)) {
            const replacement = deprecatedStyleClassMap.get(className);
            if (replacement) {
              const index = fixedClassNames.indexOf(className);
              if (index > -1) {
                fixedClassNames[index] = replacement;
              }
              context.report({
                loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
                messageId: 'deprecatedWithReplacement',
                data: { className, replacement },
                fix: () => {
                  const fixers: RuleFix[] = [];
                  if (attr.valueSpan) {
                    fixers.push({
                      range: [
                        attr.valueSpan.start.offset,
                        attr.valueSpan.end.offset,
                      ],
                      text: fixedClassNames.join(' '),
                    });
                  }
                  return fixers;
                },
              });
            } else {
              context.report({
                loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
                messageId: 'deprecatedNoReplacement',
                data: { className, docsUrl: STYLE_API_DOCS_URL },
              });
            }
            continue;
          }

          if (WHITELISTED_SKY_CLASSES.has(className)) {
            continue;
          }

          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(attr.sourceSpan),
            messageId: 'privateClass',
            data: { className },
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
      unknownThemeClass:
        `"{{className}}" is not a known sky-theme- class. See the style API documentation for valid class names: ${STYLE_API_DOCS_URL}`,
      privateClass:
        `"{{className}}" is a private SKY UX class and should not be used directly. See the style API documentation for alternatives: ${STYLE_API_DOCS_URL}`,
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
