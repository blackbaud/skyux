import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './radio-group-with-nested-list';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-radio-group></sky-radio-group>`,
    `<sky-radio-group>
      <sky-radio labelText="Foo" />
      <sky-radio>
        <sky-radio-label>Foo</sky-radio-label>
      </sky-radio>
    </sky-radio-group>`,
    `<sky-radio-group>
      @for (item of items; track: item.id) {
        <sky-radio labelText="Foo" />
      }
    </sky-radio-group>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if radio-group has nested list',
      annotatedSource: `
      <sky-radio-group>
        <ul>
        ~~~~
          <li>
          ~~~~
            <sky-radio labelText="Foo" />
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </li>
          ~~~~~
          <li>
          ~~~~
            <sky-radio><sky-radio-label>Foo</sky-radio-label></sky-radio>
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </li>
          ~~~~~
        </ul>
        ~~~~~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should fail if radio-group has nested list',
      annotatedSource: `
      <sky-radio-group>
        <ul>
        ~~~~
          <li *ngFor="let item of items">
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            <sky-radio labelText="Foo" />
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </li>
          ~~~~~
        </ul>
        ~~~~~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
  ],
});
