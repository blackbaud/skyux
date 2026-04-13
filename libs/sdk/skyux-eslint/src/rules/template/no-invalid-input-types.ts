import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-invalid-input-types';
export const messageId = 'noInvalidInputTypes';

const VALID_INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week',
]);

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element'](element: TmplAstElement): void {
        if (element.name.toLowerCase() !== 'input') {
          return;
        }

        const typeAttr = element.attributes.find(
          (attr) => attr.name === 'type',
        );

        // No type attribute defaults to "text", which is valid.
        if (!typeAttr) {
          return;
        }

        const inputType = typeAttr.value.toLowerCase();

        if (!VALID_INPUT_TYPES.has(inputType)) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(typeAttr.sourceSpan),
            messageId,
            data: {
              type: typeAttr.value,
            },
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow invalid type attribute values on <input> elements.',
    },
    messages: {
      [messageId]: 'The type "{{type}}" is not a valid HTML input type.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
