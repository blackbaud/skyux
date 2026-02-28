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

    // Input types not handled by this rule (handled by prefer-form-control-component)
    `<input type="checkbox" />`,
    `<input type="radio" />`,
    `<input type="color" />`,
    `<input type="date" />`,
    `<input type="datetime-local" />`,
    `<input type="file" />`,
    `<input type="search" />`,
    `<input type="tel" />`,
    `<input type="time" />`,

    // Input types not handled by this rule (no SKY UX equivalent)
    `<input type="hidden" />`,
    `<input type="button" />`,
    `<input type="submit" />`,
    `<input type="reset" />`,
    `<input type="image" />`,

    // Explicit input-box types inside sky-input-box
    `<sky-input-box><input type="text" /></sky-input-box>`,
    `<sky-input-box><input type="email" /></sky-input-box>`,
    `<sky-input-box><input type="number" /></sky-input-box>`,
    `<sky-input-box><input type="password" /></sky-input-box>`,
    `<sky-input-box><input type="url" /></sky-input-box>`,
    `<sky-input-box><input type="month" /></sky-input-box>`,
    `<sky-input-box><input type="week" /></sky-input-box>`,
    `<sky-input-box><input type="range" /></sky-input-box>`,

    // Inside sky-colorpicker (wraps its own input internally)
    `<sky-colorpicker><input type="text" /></sky-colorpicker>`,

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
        'should fail when input has explicit text type with no wrapper',
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
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input type="email" has no sky-input-box wrapper',
      annotatedSource: `
      <input type="email" />
      ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail when input type="number" has no sky-input-box wrapper',
      annotatedSource: `
      <input type="number" />
      ~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'input',
      },
    }),
  ],
});
