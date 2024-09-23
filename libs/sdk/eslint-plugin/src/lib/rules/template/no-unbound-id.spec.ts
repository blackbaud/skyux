import {
  RuleTester,
  convertAnnotatedSourceToFailureCase,
} from '@angular-eslint/test-utils';

import { RULE_NAME, noUnboundId } from './no-unbound-id';

const ruleTester = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    parser: require('@angular-eslint/template-parser'),
  },
});

ruleTester.run(RULE_NAME, noUnboundId, {
  valid: [
    '<button [id]="foobar"></button>',
    '<button [attr.id]="foobar"></button>',
    '<h1 id="{{ foobar }}"></h1>',
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if id attribute statically set',
      annotatedSource: `
        <span id="foobar"></span>
              ~~~~~~~~~~~
      `,
      messageId: 'noUnboundId',
      data: { element: 'span' },
    }),
  ],
});
