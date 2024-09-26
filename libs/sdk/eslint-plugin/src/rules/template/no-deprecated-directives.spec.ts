import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import { RULE_NAME, rule } from './no-deprecated-directives';

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    parser: require('@angular-eslint/template-parser'),
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using sky-card',
      annotatedSource: `
        <sky-card></sky-card>
        ~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectives',
      data: {
        reason:
          '`SkyCardComponent` is deprecated. For other SKY UX components that ' +
          'group and list content, see the content containers guidelines. For ' +
          'more information, see https://developer.blackbaud.com/skyux/design/guidelines/content-containers.',
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
