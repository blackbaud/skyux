import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { VALID_INPUT_BOX_SKY_COMPONENTS } from './utils/input-box-types';

export const RULE_NAME = 'prefer-input-box-for-sky-components';
export const messageId = 'preferInputBoxForSkyComponents';

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);
    const ancestorStack: string[] = [];

    return {
      ['Element'](element: TmplAstElement): void {
        const name = element.name.toLowerCase();
        ancestorStack.push(name);

        if (!VALID_INPUT_BOX_SKY_COMPONENTS.has(name)) {
          return;
        }

        const hasInputBox = ancestorStack.some(
          (ancestor) => ancestor === 'sky-input-box',
        );

        if (!hasInputBox) {
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
        'Require certain SKY UX form control components to be placed inside a <sky-input-box> component.',
    },
    messages: {
      [messageId]:
        '<{{element}}> should be placed inside a <sky-input-box> component.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
