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
      description:
        'should fail if labelText not set and has label element with bound text',
      annotatedSource: `
        <sky-checkbox>
        ~~~~~~~~~~~~~~
          <sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~
            {{ 'first_name' | skyAppResources }}
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~~
        </sky-checkbox>
        ~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-checkbox labelText="{{ 'first_name' | skyAppResources }}">
        ~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~~
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
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if labelText not set and has label element',
      annotatedSource: `
        <sky-checkbox>
        ~~~~~~~~~~~~~~
          <sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~
            Foo
            ~~~
          </sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~~
        </sky-checkbox>
        ~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-checkbox labelText="Foo">
        ~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~~
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
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if labelText set but label element remains',
      annotatedSource: `
        <sky-input-box labelText="foo"><label></label></sky-input-box>
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="foo"></sky-input-box>
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should remove `sky-form-control` class from inputs',
      annotatedSource: `
        <sky-input-box>
        ~~~~~~~~~~~~~~~~
          <label>My label</label>
          ~~~~~~~~~~~~~~~~~~~~~~~
          <input class="sky-form-control" type="text" />
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-input-box>
        ~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="My label">
        ~
          ~
          ~
          <input  type="text" />
          ~
        </sky-input-box>
        ~
      `,

      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should remove `sky-form-control` class from inputs with multiple classes',
      annotatedSource: `
        <sky-input-box>
        ~~~~~~~~~~~~~~~~
          <label>My label</label>
          ~~~~~~~~~~~~~~~~~~~~~~~
          <textarea class="my-input sky-form-control foobar"></textarea>
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-input-box>
        ~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="My label">
        ~
          ~
          ~
          <textarea class="my-input foobar"></textarea>
          ~
        </sky-input-box>
        ~
      `,

      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should remove `sky-form-control` class from inputs if first in list of classes',
      annotatedSource: `
        <sky-input-box>
        ~~~~~~~~~~~~~~~~
          <label>My label</label>
          ~~~~~~~~~~~~~~~~~~~~~~~
          <select class="sky-form-control foo"></select>
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-input-box>
        ~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="My label">
        ~
          ~
          ~
          <select class="foo"></select>
          ~
        </sky-input-box>
        ~
      `,

      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should remove skyId from sky-input-box inputs',
      annotatedSource: `
        <sky-input-box>
        ~~~~~~~~~~~~~~~~
          <label>My label</label>
          ~~~~~~~~~~~~~~~~~~~~~~~
          <input #myInput="skyId" skyId type="text" />
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </sky-input-box>
        ~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-input-box labelText="My label">
        ~
          ~
          ~
          <input   type="text" />
          ~
        </sky-input-box>
        ~
      `,

      messageId,
      data: {
        selector: 'sky-input-box',
        labelInputName: 'labelText',
        labelSelector: 'label',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'should fail if labelText not set and has child elements within label',
      annotatedSource: `
        <sky-checkbox>
        ~~~~~~~~~~~~~~
          <sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~
            <h2 class="sky-heading-1">Foo</h2>
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </sky-checkbox-label>
          ~~~~~~~~~~~~~~~~~~~~~
        </sky-checkbox>
        ~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
        <sky-checkbox labelText="Foo">
        ~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~
          ~~~~~~~~~~~~~~~~~~~~~
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
