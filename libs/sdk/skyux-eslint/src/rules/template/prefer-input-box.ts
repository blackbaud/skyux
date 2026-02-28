import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'prefer-input-box';
export const messageId = 'preferInputBox';

const TARGET_ELEMENTS = new Set(['input', 'select', 'textarea']);

const INPUT_BOX_INPUT_TYPES = new Set([
  'email',
  'month',
  'number',
  'password',
  'range',
  'text',
  'url',
  'week',
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

        // For input elements, only flag types that belong in sky-input-box.
        if (name === 'input') {
          const typeAttr = element.attributes.find(
            (attr) => attr.name === 'type',
          );
          const inputType = typeAttr?.value.toLowerCase() ?? 'text';
          if (!INPUT_BOX_INPUT_TYPES.has(inputType)) {
            return;
          }
        }

        // Check if any ancestor is sky-input-box or sky-colorpicker
        // (sky-colorpicker wraps its own input internally).
        const hasWrapper = ancestorStack.some(
          (ancestor) =>
            ancestor === 'sky-input-box' || ancestor === 'sky-colorpicker',
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
        'Require text-like form control elements to be placed inside a <sky-input-box> component.',
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
