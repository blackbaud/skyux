import type {
  TmplAstElement,
  TmplAstTextAttribute,
} from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';
import type { RuleFix } from '@typescript-eslint/utils/ts-eslint';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

import { LegacyIconReplacements } from './utils/no-legacy-icons-mappings';

export const RULE_NAME = 'no-legacy-icons';
export const messageId = 'noLegacyIcons';

const COMPONENTS_WITH_ICON: {
  selector: string;
  inputName: string;
  honorReplacementVariant: boolean;
}[] = [
  {
    selector: 'sky-icon',
    inputName: 'icon',
    honorReplacementVariant: true,
  },
  {
    selector: 'sky-action-button-icon',
    inputName: 'iconType',
    honorReplacementVariant: false,
  },
  {
    selector: 'sky-radio',
    inputName: 'icon',
    honorReplacementVariant: false,
  },
  {
    selector: 'sky-checkbox',
    inputName: 'icon',
    honorReplacementVariant: false,
  },
];

const SELECTORS_WITH_ICON_COMPONENTS = COMPONENTS_WITH_ICON.map(
  (c) => c.selector,
).join('|');

/**
 * Swaps the legacy icon with a new icon.
 */
function swapIcons(
  el: TmplAstTextAttribute,
  honorReplacementVariant: boolean,
): RuleFix | undefined {
  // Safety check
  /* istanbul ignore else */
  if (el.keySpan && el.valueSpan) {
    const iconReplacementInfo = LegacyIconReplacements[el.value.toString()];
    return {
      range: [el.keySpan.start.offset, el.valueSpan.end.offset + 1],
      text:
        `iconName="${iconReplacementInfo.newName}"` +
        (honorReplacementVariant && iconReplacementInfo.variant
          ? ` variant="${iconReplacementInfo.variant}"`
          : ''),
    };
  }
  /* istanbul ignore next */
  return;
}

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      [`Element[name=/^(${SELECTORS_WITH_ICON_COMPONENTS})$/]`](
        el: TmplAstElement,
      ): void {
        const componentInfo = COMPONENTS_WITH_ICON.find(
          (c) => c.selector === el.name,
        );

        /** Safety check */
        /* istanbul ignore if */
        if (!componentInfo) {
          return;
        }

        const iconAttribute = el.attributes.find(
          (input) => input.name === componentInfo.inputName,
        );

        if (iconAttribute) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(
              iconAttribute.sourceSpan,
            ),
            messageId,
            data: {
              selector: el.name,
            },
            fix: () => {
              const fixers: RuleFix[] = [];

              const variantExists = el.attributes
                .map((attribute) => attribute.name)
                .concat(el.inputs.map((input) => input.name))
                .some((attributeOrInput) => attributeOrInput === 'variant');
              if (
                iconAttribute.keySpan &&
                iconAttribute.valueSpan &&
                LegacyIconReplacements[iconAttribute.value.toString()]
              ) {
                const ruleFix = swapIcons(
                  iconAttribute,
                  !variantExists && componentInfo.honorReplacementVariant,
                );

                // Safety check
                /* istanbul ignore else */
                if (ruleFix) {
                  fixers.push(ruleFix);
                }
              }

              return fixers;
            },
          });
        } else {
          const iconInput = el.inputs.find(
            (input) => input.name === componentInfo.inputName,
          );

          if (iconInput) {
            context.report({
              loc: parserServices.convertNodeSourceSpanToLoc(
                iconInput.sourceSpan,
              ),
              messageId,
              data: {
                selector: el.name,
              },
            });
          }
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Avoid using legacy icons.',
    },
    messages: {
      [messageId]: 'The `icon` input is deprecated. Use `iconName` instead.',
    },
    schema: [],
    type: 'problem',
    fixable: 'code',
  },
  name: RULE_NAME,
});
