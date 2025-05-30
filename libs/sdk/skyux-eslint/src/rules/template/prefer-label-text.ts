import {
  TmplAstElement,
  type TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix, RuleFixer } from '@typescript-eslint/utils/ts-eslint';

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

const FORM_CONTROL_CLASS = 'sky-form-control';

function getAttributeByName(
  el: TmplAstElement,
  attrName: string,
): TmplAstTextAttribute | undefined {
  for (const attribute of el.attributes) {
    if (attribute.name === attrName) {
      return attribute;
    }
  }

  return;
}

/**
 * Removes the "sky-form-control" CSS class from <sky-input-box /> input elements
 * to satisfy the input box's input directive selector.
 * See: https://github.com/blackbaud/skyux/blob/040e461a50cb3d08ff8f7332dba350b7e97c5fd8/libs/components/forms/src/lib/modules/input-box/input-box-control.directive.ts#L11
 */
function removeFormControlClass(
  fixer: RuleFixer,
  inputEl: TmplAstElement,
): RuleFix[] {
  const fixes: RuleFix[] = [];

  const classAttr = getAttributeByName(inputEl, 'class');

  if (classAttr?.value.includes(FORM_CONTROL_CLASS)) {
    const classnames = classAttr.value;

    // Remove "class" attribute if it only contains the form control class.
    if (classnames === FORM_CONTROL_CLASS) {
      fixes.push(
        fixer.removeRange([
          classAttr.sourceSpan.start.offset,
          classAttr.sourceSpan.end.offset,
        ]),
      );
    } else {
      const index = classnames.indexOf(FORM_CONTROL_CLASS);
      const classLength = FORM_CONTROL_CLASS.length;

      /* istanbul ignore else: safety check */
      if (classAttr.valueSpan) {
        let classStart = classAttr.valueSpan.start.offset + index;
        let classEnd = classStart + classLength;

        // Account for multiple classes in the "class" attribute, and remove extra
        // whitespace.
        if (classnames.at(index - 1) === ' ') {
          classStart--;
        } else if (classnames.at(index + classLength) === ' ') {
          classEnd++;
        }

        fixes.push(fixer.removeRange([classStart, classEnd]));
      }
    }
  }

  return fixes;
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      [`Element[name=/^(${SELECTORS_WITH_LABEL_COMPONENTS})$/]`](
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

        const labelEl = getChildNodeOf(el, [labelSelector]);
        const inputEl = getChildNodeOf(el, ['input', 'select', 'textarea']);

        if (labelEl) {
          // Abort if the `skyId` directive is used on a child input of the
          // `<sky-input-box />` component since its inclusion usually means the
          // user wishes to implement "hard mode".
          if (
            el.name === 'sky-input-box' &&
            inputEl &&
            getAttributeByName(inputEl, 'skyId')
          ) {
            return;
          }

          const hasElementChildren = labelEl.children.some(
            (child) => child instanceof TmplAstElement,
          );

          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(el.sourceSpan),
            messageId,
            data: {
              selector: el.name,
              labelInputName,
              labelSelector,
            },
            // Don't fix if the label includes child elements.
            fix: hasElementChildren
              ? undefined
              : (fixer): RuleFix[] => {
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

                  if (el.name === 'sky-input-box' && inputEl) {
                    fixers.push(...removeFormControlClass(fixer, inputEl));
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
