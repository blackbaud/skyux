import {
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-sky-btn-disabled-class';
export const messageId = 'noSkyBtnDisabledClass';

/**
 * Elements that support the `disabled` attribute.
 */
const DISABLED_SUPPORTED_ELEMENTS = new Set([
  'button',
  'input',
  'optgroup',
  'option',
  'select',
  'textarea',
]);

/**
 * Checks if a class string contains 'sky-btn-disabled'.
 */
function containsSkyBtnDisabledClass(classValue: string): boolean {
  return classValue
    .split(/\s+/)
    .some((className) => className.trim() === 'sky-btn-disabled');
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element'](element: TmplAstElement): void {
        // Only check elements that support the disabled attribute
        if (!DISABLED_SUPPORTED_ELEMENTS.has(element.name.toLowerCase())) {
          return;
        }

        // Check static class attribute for sky-btn-disabled
        const classAttr = element.attributes.find(
          (attr) => attr.name === 'class',
        ) as TmplAstTextAttribute | undefined;

        if (classAttr && containsSkyBtnDisabledClass(classAttr.value)) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(
              classAttr.sourceSpan,
            ),
            messageId,
            data: {
              element: element.name,
            },
          });
          return;
        }

        // Check [class.sky-btn-disabled] binding - this is the most common dynamic case
        // Note: Angular parses [class.sky-btn-disabled] as input.name === 'sky-btn-disabled'
        // and marks it as a class binding
        const skyBtnDisabledClassInput = element.inputs.find(
          (input) => input.name === 'sky-btn-disabled',
        );

        if (skyBtnDisabledClassInput) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(
              skyBtnDisabledClassInput.sourceSpan,
            ),
            messageId,
            data: {
              element: element.name,
            },
          });
          return;
        }

        // Check [class] and [ngClass] bindings for sky-btn-disabled
        for (const input of element.inputs) {
          if (input.name === 'class' || input.name === 'ngClass') {
            // Get the raw source text from the input's source span
            const sourceFile = input.sourceSpan.start.file;
            const sourceText = sourceFile.content.slice(
              input.sourceSpan.start.offset,
              input.sourceSpan.end.offset,
            );

            // Check if the raw binding text contains sky-btn-disabled
            if (sourceText.includes('sky-btn-disabled')) {
              context.report({
                loc: parserServices.convertNodeSourceSpanToLoc(
                  input.sourceSpan,
                ),
                messageId,
                data: {
                  element: element.name,
                },
              });
              return;
            }
          }
        } // Note: This rule detects .sky-btn-disabled class usage on elements that support disabled:
        // 1. Static class="sky-btn-disabled" - NEVER allowed on elements that support disabled
        // 2. [class.sky-btn-disabled]="condition" - NEVER allowed on elements that support disabled
        //
        // Elements that support disabled should use the native disabled attribute instead:
        // - disabled (static)
        // - [disabled]="condition" (property binding)
        // - [attr.disabled]="condition" (attribute binding)
        //
        // More complex cases like [class]="dynamicClassObject" or [ngClass]="complexExpression"
        // are not detected due to the complexity of parsing arbitrary expressions.
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prevents using .sky-btn-disabled class on elements that support the disabled attribute. Use the disabled attribute instead.',
    },
    messages: {
      [messageId]:
        'The <{{element}}> element must not use the .sky-btn-disabled class. Use the disabled attribute instead for proper accessibility and semantic meaning.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
