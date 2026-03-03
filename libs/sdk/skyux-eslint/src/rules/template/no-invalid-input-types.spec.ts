import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-invalid-input-types';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // No type attribute (defaults to "text")
    `<input />`,

    // All valid HTML input types
    `<input type="button" />`,
    `<input type="checkbox" />`,
    `<input type="color" />`,
    `<input type="date" />`,
    `<input type="datetime-local" />`,
    `<input type="email" />`,
    `<input type="file" />`,
    `<input type="hidden" />`,
    `<input type="image" />`,
    `<input type="month" />`,
    `<input type="number" />`,
    `<input type="password" />`,
    `<input type="radio" />`,
    `<input type="range" />`,
    `<input type="reset" />`,
    `<input type="search" />`,
    `<input type="submit" />`,
    `<input type="tel" />`,
    `<input type="text" />`,
    `<input type="time" />`,
    `<input type="url" />`,
    `<input type="week" />`,

    // Non-input elements are not checked
    `<div></div>`,
    `<select></select>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail for an unknown type',
      annotatedSource: `
      <input type="foobar" />
             ~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        type: 'foobar',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail for an unknown type with mixed case',
      annotatedSource: `
      <input type="Foobar" />
             ~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        type: 'Foobar',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail for a common mistake like "datepicker"',
      annotatedSource: `
      <input type="datepicker" />
             ~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        type: 'datepicker',
      },
    }),
  ],
});
