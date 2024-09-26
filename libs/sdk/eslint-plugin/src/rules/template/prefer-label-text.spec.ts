import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './prefer-label-text';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-checkbox labelText="foo">`,
    `<sky-checkbox [labelText]="foo">`,
    `<sky-checkbox labelText="{{ foo }}">`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if label component found',
      annotatedSource: `
        <sky-checkbox>
        ~~~~~~~~~~~~~~
          <sky-checkbox-label></sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-checkbox>
        ~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-checkbox',
        labelInputName: 'labelText',
        labelSelector: 'sky-checkbox-label',
      },
    }),
  ],
});
