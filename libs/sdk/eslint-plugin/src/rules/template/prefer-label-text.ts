import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import { getTemplateParserServices } from '@angular-eslint/utils';

import { createESLintRule } from '../../utils/create-eslint-rule';

export const RULE_NAME = 'prefer-label-text';
export const messageId = 'preferLabelText';

// const SELECTORS_WITH_LABEL_COMPONENTS = [
//   'sky-checkbox',
//   'sky-file-attachment',
//   'sky-radio',
//   'sky-toggle-switch',
// ].join('|');

const COMPONENTS_WITH_LABEL_TEXT: {
  componentSelector: string;
  labelInputName: string;
  labelSelector: string;
}[] = [
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
    componentSelector: 'sky-box',
    labelInputName: 'headingText',
    labelSelector: 'sky-box-header',
  },
  {
    componentSelector: 'sky-input-box',
    labelInputName: 'labelText',
    labelSelector: 'label',
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

        // Abort if `labelText` already assigned.
        if (
          el.inputs.some((i) => i.name === labelInputName) ||
          el.attributes.some((i) => i.name === labelInputName)
        ) {
          return;
        }

        context.report({
          loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
          messageId,
          data: {
            selector: el.name,
            labelInputName,
            labelSelector,
          },
        });
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
        '<{{selector}}> element should set `{{labelInputName}}`. Delete the <{{labelSelector}}> element and set `{{labelInputName}}` instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: `template/${RULE_NAME}`,
});
