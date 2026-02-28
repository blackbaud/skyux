import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, rule } from './prefer-form-control-component';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Input types NOT handled by this rule
    `<input />`,
    `<input type="text" />`,
    `<input type="email" />`,
    `<input type="number" />`,
    `<input type="password" />`,
    `<input type="hidden" />`,
    `<input type="button" />`,
    `<input type="submit" />`,
    `<input type="reset" />`,
    `<input type="image" />`,
    `<input type="url" />`,
    `<input type="month" />`,
    `<input type="week" />`,
    `<input type="range" />`,

    // Non-input elements
    `<div></div>`,
    `<select></select>`,
    `<textarea></textarea>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="checkbox"',
      annotatedSource: `
      <input type="checkbox" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyCheckbox',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="color"',
      annotatedSource: `
      <input type="color" />
      ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyColorpicker',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="date"',
      annotatedSource: `
      <input type="date" />
      ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyDatepicker',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="datetime-local"',
      annotatedSource: `
      <input type="datetime-local" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyDatepickerTimepicker',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="file"',
      annotatedSource: `
      <input type="file" />
      ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyFileAttachment',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="radio"',
      annotatedSource: `
      <input type="radio" />
      ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyRadio',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="search"',
      annotatedSource: `
      <input type="search" />
      ~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkySearch',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="tel"',
      annotatedSource: `
      <input type="tel" />
      ~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyPhoneField',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type="time"',
      annotatedSource: `
      <input type="time" />
      ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyTimepicker',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should flag input type with mixed case',
      annotatedSource: `
      <input type="CHECKBOX" />
      ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'preferSkyCheckbox',
    }),
  ],
});
