import {
  type TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'prefer-disabled-attr';
export const messageId = 'preferDisabledAttr';

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

/**
 * Removes 'sky-btn-disabled' from a class string and returns the cleaned string.
 */
function removeSkyBtnDisabledClass(classValue: string): string {
  return classValue
    .split(/\s+/)
    .filter((className) => className.trim() !== 'sky-btn-disabled')
    .join(' ')
    .trim();
}

/**
 * Checks if an element already has a disabled attribute.
 */
function hasDisabledAttribute(element: TmplAstElement): boolean {
  return (
    element.attributes.some((attr) => attr.name === 'disabled') ||
    element.inputs.some((input) => input.name === 'disabled')
  );
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
            fix: () => {
              const fixers: RuleFix[] = [];
              const cleanedClasses = removeSkyBtnDisabledClass(classAttr.value);
              const hasExistingDisabled = hasDisabledAttribute(element);

              // If there are other classes, update the class attribute
              if (cleanedClasses) {
                if (classAttr.valueSpan) {
                  fixers.push({
                    range: [
                      classAttr.valueSpan.start.offset,
                      classAttr.valueSpan.end.offset,
                    ],
                    text: cleanedClasses,
                  });
                }
              } else {
                // Remove the entire class attribute including one preceding space if present
                const sourceFile = classAttr.sourceSpan.start.file.content;
                let startPos = classAttr.sourceSpan.start.offset;

                // Check if there's a space before the class attribute and include it
                if (startPos > 0 && sourceFile[startPos - 1] === ' ') {
                  startPos--;
                }

                fixers.push({
                  range: [startPos, classAttr.sourceSpan.end.offset],
                  text: '',
                });
              }

              // Add disabled attribute if not already present
              if (!hasExistingDisabled) {
                // Insert disabled attribute after the opening tag name
                const elementStart = element.sourceSpan.start.offset;
                const tagName = element.name;
                const insertPosition = elementStart + tagName.length + 1; // +1 for '<'

                fixers.push({
                  range: [insertPosition, insertPosition],
                  text: ' disabled',
                });
              }

              return fixers;
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
            fix: () => {
              const fixers: RuleFix[] = [];
              const hasExistingDisabled = hasDisabledAttribute(element);

              // Remove the [class.sky-btn-disabled] binding including one preceding space if present
              const sourceFile =
                skyBtnDisabledClassInput.sourceSpan.start.file.content;
              let startPos = skyBtnDisabledClassInput.sourceSpan.start.offset;

              // Check if there's a space before the binding and include it
              if (startPos > 0 && sourceFile[startPos - 1] === ' ') {
                startPos--;
              }

              fixers.push({
                range: [
                  startPos,
                  skyBtnDisabledClassInput.sourceSpan.end.offset,
                ],
                text: '',
              });

              // Add [disabled] binding if not already present
              if (!hasExistingDisabled) {
                // Get the expression source text from the binding
                const sourceFile =
                  skyBtnDisabledClassInput.sourceSpan.start.file.content;
                const expressionStart =
                  skyBtnDisabledClassInput.value.sourceSpan.start;
                const expressionEnd =
                  skyBtnDisabledClassInput.value.sourceSpan.end;
                const expressionText = sourceFile.slice(
                  expressionStart,
                  expressionEnd,
                );

                // Insert [disabled] attribute after the opening tag name
                const elementStart = element.sourceSpan.start.offset;
                const tagName = element.name;
                const insertPosition = elementStart + tagName.length + 1; // +1 for '<'

                fixers.push({
                  range: [insertPosition, insertPosition],
                  text: ` [disabled]="${expressionText}"`,
                });
              }

              return fixers;
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
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Prefer the disabled attribute over .sky-btn-disabled class for elements that support the disabled attribute.',
    },
    messages: {
      [messageId]:
        'Use the disabled attribute instead of the .sky-btn-disabled class on <{{element}}> elements for proper accessibility and semantic meaning.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
