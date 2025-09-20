import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-radio-group-with-nested-list';

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
      @for (item of items; track item.name) {
        <sky-radio labelText="Foo" />
      }
    </sky-radio-group>`,
    `<sky-radio-group>
      <sky-radio *ngFor="let item of items" labelText="Foo" />
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
      annotatedOutput: `
      <sky-radio-group>
        ~
        ~
          ~
          ~
            <sky-radio labelText="Foo" />
            ~
          ~
          ~
          ~
          ~
            <sky-radio><sky-radio-label>Foo</sky-radio-label></sky-radio>
            ~
          ~
          ~
        ~
        ~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should handle ngFor structural directives',
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
      annotatedOutput: `
      <sky-radio-group>
        ~
        ~
          <ng-container *ngFor="let item of items">
          ~
            <sky-radio labelText="Foo" />
            ~
          </ng-container>
          ~
        ~
        ~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should ignore other structural directives',
      annotatedSource: `
      <sky-radio-group>
        <ul>
        ~~~~
          <li *ngIf="foobar">
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            <sky-radio labelText="Foo" />
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          </li>
          ~~~~~
        </ul>
        ~~~~~
      </sky-radio-group>
      `,
      annotatedOutput: `
      <sky-radio-group>
        ~
        ~
          ~
          ~
            <sky-radio labelText="Foo" />
            ~
          ~
          ~
        ~
        ~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'should handle built-in control flow',
      annotatedSource: `
      <sky-radio-group>
        <ul>
        ~~~~
          @for (item of items; track item.name) {
            <li>
            ~~~~
              <sky-radio labelText="Foo" />
              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            </li>
            ~~~~~
          }
        </ul>
        ~~~~~
      </sky-radio-group>
      `,
      annotatedOutput: `
      <sky-radio-group>
        ~
        ~
          @for (item of items; track item.name) {
            ~
            ~
              <sky-radio labelText="Foo" />
              ~
            ~
            ~
          }
        ~
        ~
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
  ],
});
