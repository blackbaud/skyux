import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'prefer-input-box';
export const messageId = 'preferInputBox';

const TARGET_ELEMENTS = new Set(['input', 'select', 'textarea']);

const EXEMPT_INPUT_TYPES = new Set([
  'hidden',
  'button',
  'submit',
  'reset',
  'image',
  'checkbox',
  'radio',
]);

const WRAPPER_COMPONENTS = new Set([
  'sky-input-box',
  'sky-datepicker',
  'sky-lookup',
  'sky-autocomplete',
  'sky-country-field',
  'sky-phone-field',
  'sky-colorpicker',
  'sky-timepicker',
]);

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);
    const ancestorStack: string[] = [];

    return {
      ['Element'](element: TmplAstElement): void {
        const name = element.name.toLowerCase();
        ancestorStack.push(name);

        if (!TARGET_ELEMENTS.has(name)) {
          return;
        }

        // Check for exempt input types.
        if (name === 'input') {
          const typeAttr = element.attributes.find(
            (attr) => attr.name === 'type',
          );
          if (
            typeAttr &&
            EXEMPT_INPUT_TYPES.has(typeAttr.value.toLowerCase())
          ) {
            return;
          }
        }

        // Check if any ancestor is a wrapper component.
        const hasWrapper = ancestorStack.some((ancestor) =>
          WRAPPER_COMPONENTS.has(ancestor),
        );

        if (!hasWrapper) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
            messageId,
            data: {
              element: name,
            },
          });
        }
      },
      ['Element:exit'](): void {
        ancestorStack.pop();
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Require native form control elements to be placed inside a <sky-input-box> component.',
    },
    messages: {
      [messageId]:
        '<{{element}}> elements should be placed inside a <sky-input-box> component.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
