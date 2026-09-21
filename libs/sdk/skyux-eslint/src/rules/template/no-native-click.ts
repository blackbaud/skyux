import type {
  TmplAstBoundEvent,
  TmplAstElement,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'no-native-click';
export const messageId = 'noNativeClick';

/**
 * Components whose native `click` event is wired 1:1 to an internal
 * button/anchor and should be replaced with the listed output instead.
 */
const COMPONENTS_WITH_NATIVE_CLICK: {
  selector: string;
  alternativeOutput: string;
}[] = [
  { selector: 'sky-button', alternativeOutput: 'buttonClick' },
  { selector: 'sky-action-button', alternativeOutput: 'actionClick' },
  { selector: 'sky-filter-button', alternativeOutput: 'filterButtonClick' },
  {
    selector: 'sky-progress-indicator-nav-button',
    alternativeOutput: 'actionClick',
  },
  {
    selector: 'sky-progress-indicator-reset-button',
    alternativeOutput: 'resetClick',
  },
  {
    selector: 'sky-summary-action-bar-primary-action',
    alternativeOutput: 'actionClick',
  },
  {
    selector: 'sky-summary-action-bar-secondary-action',
    alternativeOutput: 'actionClick',
  },
  {
    selector: 'sky-summary-action-bar-cancel',
    alternativeOutput: 'actionClick',
  },
  { selector: 'sky-help-inline', alternativeOutput: 'actionClick' },
];

const SELECTORS_WITH_NATIVE_CLICK = COMPONENTS_WITH_NATIVE_CLICK.map(
  (c) => c.selector,
).join('|');

/**
 * A handler referencing `$event` may depend on the native click's event
 * shape, which the alternative output does not always match, so it's not
 * safe to rename automatically.
 */
function handlerUsesEventArgument(clickOutput: TmplAstBoundEvent): boolean {
  const { start, end } = clickOutput.handlerSpan;

  return /\$event\b/.test(start.file.content.slice(start.offset, end.offset));
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      [`Element[name=/^(${SELECTORS_WITH_NATIVE_CLICK})$/]`](
        el: TmplAstElement,
      ): void {
        const componentInfo = COMPONENTS_WITH_NATIVE_CLICK.find(
          (c) => c.selector === el.name,
        );

        /* v8 ignore start */
        if (!componentInfo) {
          return;
        }
        /* v8 ignore stop */

        const clickOutput = el.outputs.find(
          (output) => output.name === 'click' && !output.target,
        );

        if (clickOutput) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(
              clickOutput.sourceSpan,
            ),
            messageId,
            data: {
              selector: el.name,
              alternativeOutput: componentInfo.alternativeOutput,
            },
            fix: handlerUsesEventArgument(clickOutput)
              ? undefined
              : (): RuleFix => ({
                  range: [
                    clickOutput.keySpan.start.offset,
                    clickOutput.keySpan.end.offset,
                  ],
                  text: componentInfo.alternativeOutput,
                }),
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Disallow binding a component's native click event; use its dedicated output instead.",
    },
    messages: {
      [messageId]:
        "Do not bind (click) on <{{selector}}>. It relies on an internal element's native click bubbling, which is unreliable for assistive technology. Use ({{alternativeOutput}}) instead.",
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
