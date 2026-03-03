import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import {
  RULE_NAME,
  messageId,
  rule,
} from './prefer-input-box-for-sky-components';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Inside sky-input-box
    `<sky-input-box><sky-datepicker><input /></sky-datepicker></sky-input-box>`,
    `<sky-input-box><sky-timepicker><input /></sky-timepicker></sky-input-box>`,
    `<sky-input-box><sky-phone-field><input /></sky-phone-field></sky-input-box>`,
    `<sky-input-box><sky-lookup /></sky-input-box>`,
    `<sky-input-box><sky-autocomplete><input /></sky-autocomplete></sky-input-box>`,
    `<sky-input-box><sky-country-field /></sky-input-box>`,

    // Nested deeper inside sky-input-box
    `<sky-input-box><div><sky-datepicker><input /></sky-datepicker></div></sky-input-box>`,

    // Elements not in the target set
    `<sky-checkbox />`,
    `<sky-search />`,
    `<sky-colorpicker><input /></sky-colorpicker>`,
    `<div></div>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-datepicker is not inside sky-input-box',
      annotatedSource: `
      <sky-datepicker><input /></sky-datepicker>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-datepicker',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-timepicker is not inside sky-input-box',
      annotatedSource: `
      <sky-timepicker><input /></sky-timepicker>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-timepicker',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-phone-field is not inside sky-input-box',
      annotatedSource: `
      <sky-phone-field><input /></sky-phone-field>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-phone-field',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when sky-lookup is not inside sky-input-box',
      annotatedSource: `
      <sky-lookup />
      ~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-lookup',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-autocomplete is not inside sky-input-box',
      annotatedSource: `
      <sky-autocomplete><input /></sky-autocomplete>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-autocomplete',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-country-field is not inside sky-input-box',
      annotatedSource: `
      <sky-country-field></sky-country-field>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-country-field',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-datepicker is inside a non-input-box wrapper',
      annotatedSource: `
      <div><sky-datepicker><input /></sky-datepicker></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'sky-datepicker',
      },
    }),
  ],
});
