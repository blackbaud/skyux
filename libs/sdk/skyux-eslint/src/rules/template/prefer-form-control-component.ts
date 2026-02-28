import { type TmplAstElement } from '@angular-eslint/bundled-angular-compiler';
import {
  ensureTemplateParser,
  getTemplateParserServices,
} from '@angular-eslint/utils';

import { createESLintTemplateRule } from '../utils/create-eslint-template-rule';

export const RULE_NAME = 'prefer-form-control-component';

const TYPE_TO_MESSAGE_ID: Record<string, string> = {
  checkbox: 'preferSkyCheckbox',
  color: 'preferSkyColorpicker',
  date: 'preferSkyDatepicker',
  'datetime-local': 'preferSkyDatepickerTimepicker',
  file: 'preferSkyFileAttachment',
  radio: 'preferSkyRadio',
  search: 'preferSkySearch',
  tel: 'preferSkyPhoneField',
  time: 'preferSkyTimepicker',
};

export const messageIds = Object.values(TYPE_TO_MESSAGE_ID);

export const rule = createESLintTemplateRule({
  create(context) {
    ensureTemplateParser(context);

    const parserServices = getTemplateParserServices(context);

    return {
      ['Element'](element: TmplAstElement): void {
        if (element.name.toLowerCase() !== 'input') {
          return;
        }

        const typeAttr = element.attributes.find(
          (attr) => attr.name === 'type',
        );

        if (!typeAttr) {
          return;
        }

        const inputType = typeAttr.value.toLowerCase();
        const msgId = TYPE_TO_MESSAGE_ID[inputType];

        if (msgId) {
          context.report({
            loc: parserServices.convertNodeSourceSpanToLoc(element.sourceSpan),
            messageId: msgId,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Recommend SKY UX components instead of native HTML input elements for certain input types.',
    },
    messages: {
      preferSkyCheckbox:
        'Use <sky-checkbox> (optionally with <sky-checkbox-group>) instead of <input type="checkbox">.',
      preferSkyColorpicker:
        'Use <sky-colorpicker> instead of <input type="color">.',
      preferSkyDatepicker:
        'Use <sky-datepicker> instead of <input type="date">.',
      preferSkyDatepickerTimepicker:
        'Use <sky-datepicker> and <sky-timepicker> (two separate fields) instead of <input type="datetime-local">.',
      preferSkyFileAttachment:
        'Use <sky-file-attachment> (single file) or <sky-file-drop> (multiple files) instead of <input type="file">.',
      preferSkyRadio:
        'Use <sky-radio-group> and <sky-radio> instead of <input type="radio">.',
      preferSkySearch: 'Use <sky-search> instead of <input type="search">.',
      preferSkyPhoneField:
        'Use <sky-phone-field> instead of <input type="tel">.',
      preferSkyTimepicker:
        'Use <sky-timepicker> instead of <input type="time">.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: RULE_NAME,
});
