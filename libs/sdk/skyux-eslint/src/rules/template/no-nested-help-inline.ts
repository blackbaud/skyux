import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-nested-help-inline';
export const messageId = 'noNestedHelpInline';

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
 * Returns the outermost wrapper that doesn't support a nested help inline,
 * ignoring wrappers outside the nearest container that does.
 */
function findOutermostWrapper(
  ancestors: unknown[],
): TmplAstElement | undefined {
  let wrapper: TmplAstElement | undefined;

  for (let i = ancestors.length - 1; i >= 0; i--) {
    const ancestor = ancestors[i];

    if (!(ancestor instanceof TmplAstElement)) {
      continue;
    }

    if (CONTAINERS_WITH_HELP_SUPPORT.has(ancestor.name)) {
      break;
    }

    if (WRAPPERS_WITHOUT_HELP_SUPPORT.has(ancestor.name)) {
      wrapper = ancestor;
    }
  }

  return wrapper;
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element[name=sky-help-inline]'](element: TmplAstElement): void {
        const wrapper = findOutermostWrapper(
          context.sourceCode.getAncestors(element as never) as unknown[],
        );

        if (!wrapper) {
          return;
        }

        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
          messageId,
          data: { element: wrapper.name },
        });
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow nesting sky-help-inline within SKY UX components that do not support it.',
    },
    messages: {
      [messageId]:
        'Do not nest sky-help-inline within {{element}}, which does not support it.',
    },
    schema: [],
    type: 'problem',
  },
  name: RULE_NAME,
});
