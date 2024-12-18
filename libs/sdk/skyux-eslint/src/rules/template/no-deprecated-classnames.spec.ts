import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-deprecated-classnames';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [``],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail with one classname',
      annotatedSource: `
      <div class="sky-margin-inline-compact"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <div class="sky-margin-inline-xs"></div>
           ~
      `,
      messageId,
      data: {
        deprecated: 'sky-margin-inline-compact',
        replacement: 'sky-margin-inline-xs',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail with multiple classnames',
      annotatedSource: `
      <div class="sky-margin-inline-compact sky-field-label"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <div class="sky-margin-inline-xs sky-font-data-label"></div>
           ~
      `,
      messageId,
      data: {
        deprecated: 'sky-margin-inline-compact, sky-field-label',
        replacement: 'sky-margin-inline-xs, sky-font-data-label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should ignore other classnames',
      annotatedSource: `
      <div class="sky-margin-inline-compact foobar sky-field-label"></div>
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <div class="sky-margin-inline-xs foobar sky-font-data-label"></div>
           ~
      `,
      messageId,
      data: {
        deprecated: 'sky-margin-inline-compact, sky-field-label',
        replacement: 'sky-margin-inline-xs, sky-font-data-label',
      },
    }),
  ],
});
