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
  SKY_CLASSNAME_MESSAGES,
  STYLE_API_DOCS_URL,
  checkSkyClassName,
} from '../utils/style-public-api';

export const RULE_NAME = 'no-invalid-sky-classnames';

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    function checkClassName(
      className: string,
      loc: ReturnType<typeof parserServices.convertNodeSourceSpanToLoc>,
      getDeprecatedWithReplacementFix: (replacement: string) => RuleFix[],
    ): void {
      const result = checkSkyClassName(className);

      if (result.type === 'valid') {
        return;
      }

      if (result.type === 'unknownThemeClass') {
        context.report({
          loc,
          messageId: 'unknownThemeClass',
          data: { className, docsUrl: STYLE_API_DOCS_URL },
        });
        return;
      }

      if (result.type === 'deprecatedWithReplacement') {
        const { replacement } = result;
        context.report({
          loc,
          messageId: 'deprecatedWithReplacement',
          data: { className, replacement },
          fix: () => getDeprecatedWithReplacementFix(replacement),
        });
        return;
      }

      if (result.type === 'deprecatedNoReplacement') {
        context.report({
          loc,
          messageId: 'deprecatedNoReplacement',
          data: { className, docsUrl: STYLE_API_DOCS_URL },
        });
        return;
      }

      context.report({
        loc,
        messageId: 'notPublicApi',
        data: { className, docsUrl: STYLE_API_DOCS_URL },
      });
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
            /* c8 ignore next 3 */
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
            /* c8 ignore next 3 */
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
    messages: SKY_CLASSNAME_MESSAGES,
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
