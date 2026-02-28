import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-invalid-input-box-children';
export const invalidChildMessageId = 'noInvalidInputBoxChildren';
export const multipleChildrenMessageId = 'multipleInputBoxChildren';

const VALID_INPUT_BOX_INPUT_TYPES = new Set([
  'email',
  'month',
  'number',
  'password',
  'range',
  'text',
  'url',
  'week',
]);

const VALID_SKY_COMPONENTS = new Set([
  'sky-autocomplete',
  'sky-country-field',
  'sky-datepicker',
  'sky-lookup',
  'sky-phone-field',
  'sky-timepicker',
]);

/**
 * SKY UX components that are valid inside sky-input-box but are not
 * form controls (indicators, validation messages, etc.).
 */
const ALLOWED_NON_CONTROL_SKY_COMPONENTS = new Set([
  'sky-character-counter-indicator',
  'sky-form-error',
  'sky-status-indicator',
]);

const NATIVE_FORM_CONTROLS = new Set(['input', 'select', 'textarea']);

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
        if (VALID_SKY_COMPONENTS.has(ancestor)) {
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

          // name === 'input'
          const typeAttr = element.attributes.find(
            (attr) => attr.name === 'type',
          );
          const inputType = typeAttr?.value.toLowerCase() ?? 'text';

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
          if (VALID_SKY_COMPONENTS.has(name)) {
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
