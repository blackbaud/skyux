import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, rule } from './no-invalid-sky-classnames';

jest.mock('../utils/style-public-api', () => ({
  deprecatedStyleClassMap: new Map([
    ['sky-deprecated-class', 'sky-theme-new-class'],
    ['sky-obsolete-class', 'sky-theme-new-class'],
    ['sky-deprecated-class-2', 'sky-theme-new-class-2'],
    ['sky-deprecated-no-replacement', undefined],
  ]),
  validPublicClassNames: new Set([
    'sky-theme-new-class',
    'sky-theme-valid-class',
  ]),
  WHITELISTED_SKY_CLASSES: new Set(['sky-btn', 'sky-btn-primary']),
}));

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    // Non-sky classes are ignored.
    `<div class="my-class another-class"></div>`,
    // Whitelisted sky- classes are allowed.
    `<div class="sky-btn"></div>`,
    `<div class="sky-btn sky-btn-primary"></div>`,
    // Valid sky-theme- classes are allowed.
    `<div class="sky-theme-valid-class"></div>`,
    // Empty class attributes are allowed.
    `<div class=""></div>`,
    // Bound class bindings: non-sky are ignored.
    `<div [class.my-custom-class]="true"></div>`,
    // Bound class bindings: whitelisted classes are allowed.
    `<div [class.sky-btn]="true"></div>`,
    // Bound class bindings: valid sky-theme- classes are allowed.
    `<div [class.sky-theme-valid-class]="true"></div>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should error for a deprecated class with a replacement',
      annotatedSource: `
      <div class="sky-deprecated-class"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <div class="sky-theme-new-class"></div>
           ~
      `,
      messageId: 'deprecatedWithReplacement',
      data: {
        className: 'sky-deprecated-class',
        replacement: 'sky-theme-new-class',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should error for an obsolete class with a replacement',
      annotatedSource: `
      <div class="sky-obsolete-class"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <div class="sky-theme-new-class"></div>
           ~
      `,
      messageId: 'deprecatedWithReplacement',
      data: {
        className: 'sky-obsolete-class',
        replacement: 'sky-theme-new-class',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should error for an unknown sky-theme- class',
      annotatedSource: `
      <div class="sky-theme-does-not-exist"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'unknownThemeClass',
      data: { className: 'sky-theme-does-not-exist' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should error for a private sky- class',
      annotatedSource: `
      <div class="sky-private-class"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'privateClass',
      data: { className: 'sky-private-class' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should error for a deprecated class with no replacement',
      annotatedSource: `
      <div class="sky-deprecated-no-replacement"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'deprecatedNoReplacement',
      data: {
        className: 'sky-deprecated-no-replacement',
        docsUrl: 'https://developer.blackbaud.com/skyux/design/styles',
      },
    }),
    {
      code: `<div class="sky-deprecated-class sky-deprecated-class-2"></div>`,
      errors: [
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class',
            replacement: 'sky-theme-new-class',
          },
        },
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class-2',
            replacement: 'sky-theme-new-class-2',
          },
        },
      ],
      output: [
        `<div class="sky-theme-new-class sky-deprecated-class-2"></div>`,
        `<div class="sky-theme-new-class sky-theme-new-class-2"></div>`,
      ],
    },
    // Bound class bindings.
    {
      code: `<div [class.sky-deprecated-class]="true"></div>`,
      errors: [
        {
          messageId: 'deprecatedWithReplacement',
          data: {
            className: 'sky-deprecated-class',
            replacement: 'sky-theme-new-class',
          },
        },
      ],
      output: `<div [class.sky-theme-new-class]="true"></div>`,
    },
    {
      code: `<div [class.sky-deprecated-no-replacement]="true"></div>`,
      errors: [
        {
          messageId: 'deprecatedNoReplacement',
          data: {
            className: 'sky-deprecated-no-replacement',
            docsUrl: 'https://developer.blackbaud.com/skyux/design/styles',
          },
        },
      ],
    },
    {
      code: `<div [class.sky-theme-does-not-exist]="true"></div>`,
      errors: [
        {
          messageId: 'unknownThemeClass',
          data: { className: 'sky-theme-does-not-exist' },
        },
      ],
    },
    {
      code: `<div [class.sky-private-class]="true"></div>`,
      errors: [
        {
          messageId: 'privateClass',
          data: { className: 'sky-private-class' },
        },
      ],
    },
  ],
});
