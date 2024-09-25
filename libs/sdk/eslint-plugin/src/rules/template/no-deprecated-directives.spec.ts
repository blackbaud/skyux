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
      data: { element: 'sky-card' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated property',
      annotatedSource: `
        <sky-file-attachment [validatorFn]="foo"></sky-file-attachment>
                             ~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: { element: 'sky-file-attachment', property: 'validatorFn' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail when using deprecated property',
      annotatedSource: `
        <sky-file-attachment [validatorFn]="foo"></sky-file-attachment>
                             ~~~~~~~~~~~~~~~~~~~
      `,
      messageId: 'noDeprecatedDirectiveProperties',
      data: { element: 'sky-file-attachment', property: 'validatorFn' },
    }),
  ],
});
