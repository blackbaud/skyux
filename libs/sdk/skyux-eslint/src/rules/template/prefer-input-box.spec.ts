import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './prefer-input-box';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Inside sky-input-box
    `<sky-input-box><input /></sky-input-box>`,
    `<sky-input-box><select></select></sky-input-box>`,
    `<sky-input-box><textarea></textarea></sky-input-box>`,

    // Nested deeper inside sky-input-box
    `<sky-input-box><div><input /></div></sky-input-box>`,

    // Exempt input types
    `<input type="hidden" />`,
    `<input type="button" />`,
    `<input type="submit" />`,
    `<input type="reset" />`,
    `<input type="image" />`,
    `<input type="checkbox" />`,
    `<input type="radio" />`,

    // Inside wrapper components
    `<sky-datepicker><input /></sky-datepicker>`,
    `<sky-lookup><input /></sky-lookup>`,
    `<sky-autocomplete><input /></sky-autocomplete>`,
    `<sky-country-field><input /></sky-country-field>`,
    `<sky-phone-field><input /></sky-phone-field>`,
    `<sky-colorpicker><input /></sky-colorpicker>`,
    `<sky-timepicker><input /></sky-timepicker>`,

    // Non-target elements
    `<div></div>`,
    `<span></span>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when input has no wrapper ancestor',
      annotatedSource: `
      <input />
      ~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when select has no wrapper ancestor',
      annotatedSource: `
      <select></select>
      ~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'select',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when textarea has no wrapper ancestor',
      annotatedSource: `
      <textarea></textarea>
      ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'textarea',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input has explicit non-exempt type with no wrapper',
      annotatedSource: `
      <input type="text" />
      ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when input is inside a non-wrapper ancestor',
      annotatedSource: `
      <div><input /></div>
           ~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
  ],
});
