import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import {
  NATIVE_FORM_CONTROLS,
  VALID_INPUT_BOX_INPUT_TYPES,
  VALID_INPUT_BOX_SKY_COMPONENTS,
} from './utils/input-box-types';

export const RULE_NAME = 'no-invalid-input-box-children';
export const invalidChildMessageId = 'noInvalidInputBoxChildren';
export const multipleChildrenMessageId = 'multipleInputBoxChildren';

/**
 * SKY UX components that are valid inside sky-input-box but are not
 * form controls (indicators, validation messages, etc.).
 */
const ALLOWED_NON_CONTROL_SKY_COMPONENTS = new Set([
  'sky-character-counter-indicator',
  'sky-form-error',
  'sky-status-indicator',
]);

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    interface InputBoxContext {
      element: TmplAstElement;
      formControlCount: number;
    }

    const inputBoxStack: InputBoxContext[] = [];
    const ancestorStack: string[] = [];

    function isInsideValidSkyComponent(): boolean {
      // Check if there is a valid sky component between the nearest
      // sky-input-box and the current element in the ancestor stack.
      // Start at length - 2 to skip the current element itself.
      for (let i = ancestorStack.length - 2; i >= 0; i--) {
        const ancestor = ancestorStack[i];
        if (ancestor === 'sky-input-box') {
          break;
        }
        if (VALID_INPUT_BOX_SKY_COMPONENTS.has(ancestor)) {
          return true;
        }
      }
      return false;
    }

    function getCurrentInputBox(): InputBoxContext | undefined {
      return inputBoxStack.length > 0
        ? inputBoxStack[inputBoxStack.length - 1]
        : undefined;
    }

    return {
      ['Element'](element: TmplAstElement): void {
        const name = element.name.toLowerCase();
        ancestorStack.push(name);

        if (name === 'sky-input-box') {
          const parentInputBox = getCurrentInputBox();

          if (parentInputBox && !isInsideValidSkyComponent()) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                element.sourceSpan,
              ),
              messageId: invalidChildMessageId,
              data: {
                element: '<sky-input-box>',
              },
            });
          }

          inputBoxStack.push({ element, formControlCount: 0 });
          return;
        }

        const currentInputBox = getCurrentInputBox();

        if (!currentInputBox) {
          return;
        }

        // Skip elements nested inside a valid sky component within sky-input-box.
        if (isInsideValidSkyComponent()) {
          return;
        }

        const isNativeFormControl = NATIVE_FORM_CONTROLS.has(name);
        const isSkyComponent = name.startsWith('sky-');

        if (!isNativeFormControl && !isSkyComponent) {
          return;
        }

        // Allow non-control sky components (indicators, validation, etc.).
        if (ALLOWED_NON_CONTROL_SKY_COMPONENTS.has(name)) {
          return;
        }

        if (isNativeFormControl) {
          if (name === 'select' || name === 'textarea') {
            currentInputBox.formControlCount++;
            return;
          }

          const hasBoundType = element.inputs.some((attr) =>
            ['type', 'attr.type'].includes(attr.name),
          );
          if (hasBoundType) {
            return;
          }

          // name === 'input'
          const typeAttr = element.attributes.find(
            (attr) => attr.name === 'type',
          );
          const inputType = typeAttr?.value.trim().toLowerCase() || 'text';

          if (VALID_INPUT_BOX_INPUT_TYPES.has(inputType)) {
            currentInputBox.formControlCount++;
          } else {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                element.sourceSpan,
              ),
              messageId: invalidChildMessageId,
              data: {
                element: `<input type="${inputType}">`,
              },
            });
          }
        } else if (isSkyComponent) {
          if (VALID_INPUT_BOX_SKY_COMPONENTS.has(name)) {
            currentInputBox.formControlCount++;
          } else {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                element.sourceSpan,
              ),
              messageId: invalidChildMessageId,
              data: {
                element: `<${name}>`,
              },
            });
          }
        }
      },
      ['Element:exit'](element: TmplAstElement): void {
        const name = element.name.toLowerCase();
        ancestorStack.pop();

        if (name === 'sky-input-box') {
          const inputBoxContext = inputBoxStack.pop();

          if (inputBoxContext && inputBoxContext.formControlCount > 1) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                inputBoxContext.element.sourceSpan,
              ),
              messageId: multipleChildrenMessageId,
              data: {
                count: String(inputBoxContext.formControlCount),
              },
            });
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow invalid form control elements inside <sky-input-box>.',
    },
    messages: {
      [invalidChildMessageId]:
        '{{element}} is not a valid child of <sky-input-box>.',
      [multipleChildrenMessageId]:
        '<sky-input-box> should contain only one form control, but found {{count}}.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
