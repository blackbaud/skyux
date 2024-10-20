import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-unbound-id';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
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
      messageId,
      data: { selector: 'span' },
    }),
  ],
});
