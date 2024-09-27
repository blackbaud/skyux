import { TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../utils/create-eslint-rule';
import { getChildNodeOf } from '../utils/get-child-node-of';

export const RULE_NAME = 'prefer-label-text';
export const messageId = 'preferLabelText';

const COMPONENTS_WITH_LABEL_TEXT: {
  componentSelector: string;
  labelInputName: string;
  labelSelector: string;
}[] = [
  {
    componentSelector: 'sky-box',
    labelInputName: 'headingText',
    labelSelector: 'sky-box-header',
  },
  {
    componentSelector: 'sky-checkbox',
    labelInputName: 'labelText',
    labelSelector: 'sky-checkbox-label',
  },
  {
    componentSelector: 'sky-file-attachment',
    labelInputName: 'labelText',
    labelSelector: 'sky-file-attachment-label',
  },
  {
    componentSelector: 'sky-input-box',
    labelInputName: 'labelText',
    labelSelector: 'label',
  },
  {
    componentSelector: 'sky-modal',
    labelInputName: 'headingText',
    labelSelector: 'sky-modal-header',
  },
  {
    componentSelector: 'sky-radio',
    labelInputName: 'labelText',
    labelSelector: 'sky-radio-label',
  },
  {
    componentSelector: 'sky-toggle-switch',
    labelInputName: 'labelText',
    labelSelector: 'sky-toggle-switch-label',
  },
];

const SELECTORS_WITH_LABEL_COMPONENTS = COMPONENTS_WITH_LABEL_TEXT.map(
  (c) => c.componentSelector,
).join('|');

export const rule = createESLintRule({
  create(context) {
    const parserServices = getTemplateParserServices(context);

    return {
      [`Element$1[name=/^(${SELECTORS_WITH_LABEL_COMPONENTS})$/]`](
        el: TmplAstElement,
      ) {
        const config = COMPONENTS_WITH_LABEL_TEXT.find(
          (c) => c.componentSelector === el.name,
        );

        if (!config) {
          return;
        }

        const { labelInputName, labelSelector } = config;

        const labelTextAttr =
          el.inputs.find((i) => i.name === labelInputName) ??
          el.attributes.find((i) => i.name === labelInputName);

        if (labelTextAttr?.value) {
          const labelEl = getChildNodeOf(el, labelSelector);

          // Label element still present.
          if (labelEl) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                labelEl.sourceSpan,
              ),
              messageId: 'preferLabelTextWithoutLabelElement',
              data: {
                selector: el.name,
                labelInputName,
                labelSelector,
              },
            });
          }
        } else {
          // Label text is not defined.
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
            messageId,
            data: {
              selector: el.name,
              labelInputName,
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
      [messageId]: '<{{selector}}> element missing `{{labelInputName}}`.',
      preferLabelTextWithoutLabelElement:
        '<{{selector}}> element sets `{{labelInputName}}`; the <{{labelSelector}}> element can be removed.',
    },
    schema: [],
    type: 'problem',
  },
  name: `template/${RULE_NAME}`,
});
