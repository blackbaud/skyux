import type { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { TmplAstTemplate } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { getChildrenNodesOf, getNgFor } from '../utils/ast-utils';
import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-radio-group-with-nested-list';
export const messageId = 'noRadioGroupWithNestedList';

/**
 * Removes the start tag of the provided element.
 */
function removeStartTag(el: TmplAstElement | TmplAstTemplate): RuleFix {
  return {
    range: [el.startSourceSpan.start.offset, el.startSourceSpan.end.offset],
    text: '',
  };
}

/**
 * Removes the end tag of the provided element, if it exists.
 */
function removeEndTag(el: TmplAstElement | TmplAstTemplate): RuleFix {
  /* istanbul ignore if: safety check */
  if (!el.endSourceSpan) {
    return {
      range: [0, 0],
      text: '',
    };
  }

  return {
    range: [el.endSourceSpan.start.offset, el.endSourceSpan.end.offset],
    text: '',
  };
}

/**
 * Removes the start and end tags of the provided element. If the element
 * includes structural directives, the tags are replaced with `<ng-container>`
 * tags.
 */
function unwrap(el: TmplAstElement | TmplAstTemplate): RuleFix[] {
  const fixers: RuleFix[] = [];

  if (el instanceof TmplAstTemplate) {
    const ngFor = getNgFor(el);

    if (ngFor) {
      fixers.push({
        range: [el.startSourceSpan.start.offset, el.startSourceSpan.end.offset],
        text: `<ng-container ${ngFor}>`,
      });

      if (el.endSourceSpan) {
        fixers.push({
          range: [el.endSourceSpan.start.offset, el.endSourceSpan.end.offset],
          text: '</ng-container>',
        });
      }
    } else {
      fixers.push(removeStartTag(el), removeEndTag(el));
    }
  } else {
    fixers.push(removeStartTag(el), removeEndTag(el));
  }

  return fixers;
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      [`Element[name=sky-radio-group] :matches(Element)[name=/^(ol|ul)$/]`](
        listEl: TmplAstElement,
      ): void {
        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(listEl.sourceSpan),
          messageId,
          data: {},
          fix: () => {
            const fixers: RuleFix[] = [];

            fixers.push(removeStartTag(listEl));

            const listItems = getChildrenNodesOf(listEl, 'li');
            for (const listItem of listItems) {
              fixers.push(...unwrap(listItem));
            }

            fixers.push(removeEndTag(listEl));

            return fixers;
          },
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Avoid nesting lists within a sky-radio-group component, for accessibility reasons.',
    },
    messages: {
      [messageId]: 'Do not nest lists within sky-radio-group.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
