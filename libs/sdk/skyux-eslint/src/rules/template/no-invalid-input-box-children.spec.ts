import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import {
  RULE_NAME,
  invalidChildMessageId,
  multipleChildrenMessageId,
  rule,
} from './no-invalid-input-box-children';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Valid native form controls inside sky-input-box
    `<sky-input-box><input /></sky-input-box>`,
    `<sky-input-box><input type="text" /></sky-input-box>`,
    `<sky-input-box><input type="email" /></sky-input-box>`,
    `<sky-input-box><input type="number" /></sky-input-box>`,
    `<sky-input-box><input type="password" /></sky-input-box>`,
    `<sky-input-box><input type="url" /></sky-input-box>`,
    `<sky-input-box><input type="month" /></sky-input-box>`,
    `<sky-input-box><input type="week" /></sky-input-box>`,
    `<sky-input-box><input type="range" /></sky-input-box>`,
    `<sky-input-box><select></select></sky-input-box>`,
    `<sky-input-box><textarea></textarea></sky-input-box>`,

    // Valid sky components inside sky-input-box
    `<sky-input-box><sky-datepicker><input /></sky-datepicker></sky-input-box>`,
    `<sky-input-box><sky-timepicker><input /></sky-timepicker></sky-input-box>`,
    `<sky-input-box><sky-phone-field><input /></sky-phone-field></sky-input-box>`,
    `<sky-input-box><sky-lookup /></sky-input-box>`,
    `<sky-input-box><sky-autocomplete><input /></sky-autocomplete></sky-input-box>`,
    `<sky-input-box><sky-country-field /></sky-input-box>`,

    // Nested deeper inside sky-input-box via structural elements
    `<sky-input-box><div><input /></div></sky-input-box>`,

    // Input inside a valid sky component inside sky-input-box is not flagged
    `<sky-input-box><sky-datepicker><input type="text" /></sky-datepicker></sky-input-box>`,

    // Non-control sky components allowed inside sky-input-box
    `<sky-input-box><input /><sky-character-counter-indicator></sky-character-counter-indicator></sky-input-box>`,
    `<sky-input-box><input /><sky-status-indicator></sky-status-indicator></sky-input-box>`,
    `<sky-input-box><input /><sky-form-error></sky-form-error></sky-input-box>`,

    // Elements outside sky-input-box are not checked
    `<input type="checkbox" />`,
    `<sky-checkbox />`,
    `<div></div>`,
  ],
  invalid: [
    // Invalid input types inside sky-input-box
    // <input type="checkbox" /> = 25 chars
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input type="checkbox" is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><input type="checkbox" /></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<input type="checkbox">',
      },
    }),
    // <input type="radio" /> = 22 chars
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input type="radio" is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><input type="radio" /></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<input type="radio">',
      },
    }),
    // <input type="file" /> = 21 chars
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when input type="file" is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><input type="file" /></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<input type="file">',
      },
    }),
    // <input type="hidden" /> = 23 chars
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input type="hidden" is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><input type="hidden" /></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<input type="hidden">',
      },
    }),

    // Invalid sky components inside sky-input-box
    // <sky-checkbox></sky-checkbox> = 29 chars
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when sky-checkbox is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><sky-checkbox></sky-checkbox></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<sky-checkbox>',
      },
    }),
    // <sky-search></sky-search> = 25 chars
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when sky-search is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><sky-search></sky-search></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<sky-search>',
      },
    }),
    // <sky-colorpicker></sky-colorpicker> = 35 chars
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when sky-colorpicker is inside sky-input-box',
      annotatedSource: `
      <sky-input-box><sky-colorpicker></sky-colorpicker></sky-input-box>
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: invalidChildMessageId,
      data: {
        element: '<sky-colorpicker>',
      },
    }),

    // Multiple form controls inside sky-input-box
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-input-box contains multiple form controls',
      annotatedSource: `
      <sky-input-box><input /><input /></sky-input-box>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: multipleChildrenMessageId,
      data: {
        count: '2',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when sky-input-box contains mixed form controls',
      annotatedSource: `
      <sky-input-box><input /><select></select></sky-input-box>
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: multipleChildrenMessageId,
      data: {
        count: '2',
      },
    }),
  ],
});
