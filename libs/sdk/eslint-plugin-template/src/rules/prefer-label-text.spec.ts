import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './prefer-label-text';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-box headingText="foo">`,
    `<sky-checkbox labelText="foo">`,
    `<sky-checkbox [labelText]="foo">`,
    `<sky-checkbox labelText="{{ foo }}">`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if labelText not set',
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
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if labelText empty',
      annotatedSource: `
        <sky-input-box labelText>
        ~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-input-box>
        ~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if labelText set but label element remains',
      annotatedSource: `
        <sky-input-box labelText="foo"><label></label></sky-input-box>
                                       ~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="foo"></sky-input-box>
                                       ~~~~~~~~~~~~~~~
      `,
      messageId: 'preferLabelTextWithoutLabelElement',
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
  ],
});
