import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-sky-btn-disabled-class';

const ruleTester = createTemplateRuleTester();

// Test to explore what properties are available on input bindings
ruleTester.run(RULE_NAME + '-debug-properties', rule, {
  valid: [],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'debug [class] binding properties',
      annotatedSource: `
      <button [class]="'sky-btn-disabled'">Button</button>
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        element: 'button',
      },
    }),
  ],
});
