import {
  TmplAstElement,
  TmplAstTemplate,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-nested-help-inline';
export const messageId = 'noNestedHelpInline';
export const suggestMessageId = 'moveHelpInlineAfterWrapper';

const WRAPPERS_WITHOUT_HELP_SUPPORT = new Set([
  'sky-alert',
  'sky-label',
  'sky-token',
]);

// These project a nested `sky-help-inline.sky-control-help` into a dedicated slot.
const CONTAINERS_WITH_HELP_SUPPORT = new Set([
  'sky-key-info',
  'sky-status-indicator',
]);

/**
 * Returns the index of the outermost wrapper that doesn't support a nested
 * help inline, ignoring wrappers outside the nearest container that does.
 */
function findOutermostWrapperIndex(ancestors: unknown[]): number {
  let wrapperIndex = -1;

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const ancestor = ancestors[i];

    if (!(ancestor instanceof TmplAstElement)) {
      continue;
    }

    if (CONTAINERS_WITH_HELP_SUPPORT.has(ancestor.name)) {
      break;
    }

    if (WRAPPERS_WITHOUT_HELP_SUPPORT.has(ancestor.name)) {
      wrapperIndex = i;
    }
  }

  return wrapperIndex;
}

/**
 * Moving the help inline out of a token or a closeable alert leaves it behind
 * when the wrapper is dismissed, so those only get a suggestion. A static
 * `closeable` attribute binds a string, which is truthy unless empty, so only
 * an absent or `[closeable]="false"` input counts as not closeable.
 */
function isSafeToAutofix(wrapper: TmplAstElement): boolean {
  if (wrapper.name === 'sky-label') {
    return true;
  }

  if (
    wrapper.name !== 'sky-alert' ||
    wrapper.attributes.some((attr) => attr.name === 'closeable')
  ) {
    return false;
  }

  const closeableInput = wrapper.inputs.find(
    (input) => input.name === 'closeable',
  );

  return (
    !closeableInput || closeableInput.valueSpan?.toString().trim() === 'false'
  );
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element[name=sky-help-inline]'](element: TmplAstElement): void {
        const ancestors = context.sourceCode.getAncestors(
          element as never,
        ) as unknown[];

        const wrapperIndex = findOutermostWrapperIndex(ancestors);

        if (wrapperIndex === -1) {
          return;
        }

        const wrapper = ancestors[wrapperIndex] as TmplAstElement;
        const data = { element: wrapper.name };

        // A structural directive, control-flow block, or `hidden` attribute on
        // the wrapper, around the help inline, or on the help inline itself
        // would be lost or broken by moving the element.
        const canMove =
          !(ancestors[wrapperIndex - 1] instanceof TmplAstTemplate) &&
          ancestors
            .slice(wrapperIndex)
            .every(
              (ancestor) =>
                ancestor instanceof TmplAstElement &&
                ![...ancestor.attributes, ...ancestor.inputs].some(
                  (attr) => attr.name === 'hidden',
                ),
            );

        const moveAfterWrapper = (fixer: RuleFixer): RuleFix[] => [
          fixer.removeRange([
            element.sourceSpan.start.offset,
            element.sourceSpan.end.offset,
          ]),
          fixer.insertTextAfterRange(
            [wrapper.sourceSpan.end.offset, wrapper.sourceSpan.end.offset],
            element.sourceSpan.toString(),
          ),
        ];

        const isAutofixable = isSafeToAutofix(wrapper);

        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
          messageId,
          data,
          fix: canMove && isAutofixable ? moveAfterWrapper : null,
          suggest:
            canMove && !isAutofixable
              ? [{ messageId: suggestMessageId, data, fix: moveAfterWrapper }]
              : [],
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow nesting sky-help-inline within SKY UX components that do not support it; place it after the component instead.',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      [messageId]:
        'Do not nest sky-help-inline within {{element}}. Place it after the {{element}} element instead.',
      [suggestMessageId]: 'Move sky-help-inline after {{element}}.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
