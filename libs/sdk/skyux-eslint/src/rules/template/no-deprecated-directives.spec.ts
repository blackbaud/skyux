import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, rule } from './no-deprecated-directives';

const ruleTester = createTemplateRuleTester();

jest.mock('../../__deprecations.json', () => {
  return {
    components: {
      'sky-card': {
        deprecated: true,
        reason: 'Do not use the card component.',
      },
      'sky-file-attachment': {
        deprecated: false,
        properties: {
          fileChange: {
            reason:
              "Subscribe to the form control's `valueChanges` event instead.",
          },
          validateFn: {
            reason:
              'Add a custom Angular `Validator` function to the `FormControl` instead.',
          },
        },
      },
    },
    directives: {
      skyDeprecatedThing: {
        deprecated: true,
      },
      skyFoo: {
        properties: {
          noReason: {
            deprecated: true,
          },
        },
      },
      skyAutocomplete: {
        deprecated: false,
        properties: {
          autocompleteAttribute: {
            reason: 'Do not use it.',
          },
        },
      },
    },
  };
});

ruleTester.run(RULE_NAME, rule, {
  valid: [],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated directives',
      annotatedSource: `
        <input type="text" skyDeprecatedThing />
                           ~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectives',
      data: {
        reason: '',
        selector: 'skyDeprecatedThing',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated features of directives',
      annotatedSource: `
        <input type="text" skyAutocomplete autocompleteAttribute="foo" />
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        reason: 'Do not use it.',
        selector: 'input',
        property: 'autocompleteAttribute',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should work if a deprecated property does not have a reason',
      annotatedSource: `
        <input type="text" skyFoo noReason />
                                  ~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'noReason',
        reason: '',
        selector: 'input',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated components',
      annotatedSource: `
        <sky-card></sky-card>
        ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectives',
      data: {
        reason: 'Do not use the card component.',
        selector: 'sky-card',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using bound deprecated input',
      annotatedSource: `
        <sky-file-attachment [validateFn]="foo"></sky-file-attachment>
                             ~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'validateFn',
        reason:
          'Add a custom Angular `Validator` function to the `FormControl` instead.',
        selector: 'sky-file-attachment',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using unbound deprecated input',
      annotatedSource: `
        <sky-file-attachment validateFn="{{ foo }}" />
                             ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'validateFn',
        reason:
          'Add a custom Angular `Validator` function to the `FormControl` instead.',
        selector: 'sky-file-attachment',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated output',
      annotatedSource: `
        <sky-file-attachment (fileChange)="onFileChange()" />
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: {
        property: 'fileChange',
        reason: "Subscribe to the form control's `valueChanges` event instead.",
        selector: 'sky-file-attachment',
      },
    }),
  ],
});
