import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { getChildNodeOf, getTextContent } from '../utils/ast-utils';
import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'prefer-label-text';
export const messageId = 'preferLabelText';

const COMPONENTS_WITH_LABEL_TEXT: {
  selector: string;
  labelInputName: string;
  labelSelector: string;
}[] = [
  {
    selector: 'sky-box',
    labelInputName: 'headingText',
    labelSelector: 'sky-box-header',
  },
  {
    selector: 'sky-checkbox',
    labelInputName: 'labelText',
    labelSelector: 'sky-checkbox-label',
  },
  {
    selector: 'sky-file-attachment',
    labelInputName: 'labelText',
    labelSelector: 'sky-file-attachment-label',
  },
  {
    selector: 'sky-input-box',
    labelInputName: 'labelText',
    labelSelector: 'label',
  },
  {
    selector: 'sky-modal',
    labelInputName: 'headingText',
    labelSelector: 'sky-modal-header',
  },
  {
    selector: 'sky-radio',
    labelInputName: 'labelText',
    labelSelector: 'sky-radio-label',
  },
  {
    selector: 'sky-toggle-switch',
    labelInputName: 'labelText',
    labelSelector: 'sky-toggle-switch-label',
  },
];

const SELECTORS_WITH_LABEL_COMPONENTS = COMPONENTS_WITH_LABEL_TEXT.map(
  (c) => c.selector,
).join('|');

export const rule = createESLintTemplateRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(${SELECTORS_WITH_LABEL_COMPONENTS})$/]`](
        el: TmplAstElement,
      ): void {
        const config = COMPONENTS_WITH_LABEL_TEXT.find(
          (c) => c.selector === el.name,
        );

        /* istanbul ignore if: safety check */
        if (!config) {
          return;
        }

        const { labelInputName, labelSelector } = config;

        const hasLabelText =
          el.inputs.some((i) => i.name === labelInputName) ||
          el.attributes.some((i) => i.name === labelInputName);

        const labelEl = getChildNodeOf(el, labelSelector);

        if (labelEl) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
            messageId,
            data: {
              selector: el.name,
              labelInputName,
              labelSelector,
            },
            fix: (fixer) => {
              const textContent = getTextContent(labelEl);
              const textReplacement = ` ${labelInputName}="${textContent}"`;
              const range = [
                el.startSourceSpan.end.offset - 1,
                el.startSourceSpan.end.offset,
              ] as const;

              const fixers = [
                fixer.removeRange([
                  labelEl.sourceSpan.start.offset,
                  labelEl.sourceSpan.end.offset,
                ]),
              ];

              if (!hasLabelText) {
                fixers.push(
                  fixer.insertTextBeforeRange(range, textReplacement),
                );
              }

              return fixers;
            },
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Use label text.',
    },
    messages: {
      [messageId]:
        'Use of <{{labelSelector}}> element is not recommended. Set `{{labelInputName}}` on the <{{selector}}> element instead.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
