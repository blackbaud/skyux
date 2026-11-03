import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-nested-help-inline';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-label>Foo</sky-label>`,
    `<sky-label>Foo</sky-label><sky-help-inline helpKey="foo" />`,
    `<sky-alert>Foo</sky-alert><sky-help-inline helpKey="foo" />`,
    `<div><sky-help-inline helpKey="foo" /></div>`,
    `<sky-tokens [tokens]="tokens"><sky-help-inline helpKey="foo" /></sky-tokens>`,
    `<sky-key-info>
      <sky-key-info-value>1</sky-key-info-value>
      <sky-key-info-label>Foo</sky-key-info-label>
      <sky-help-inline class="sky-control-help" helpKey="foo" />
    </sky-key-info>`,
    `<sky-status-indicator descriptionType="none">
      Foo
      <sky-help-inline class="sky-control-help" helpKey="foo" />
    </sky-status-indicator>`,
    `<sky-alert>
      <sky-status-indicator descriptionType="none">
        Foo
        <sky-help-inline class="sky-control-help" helpKey="foo" />
      </sky-status-indicator>
    </sky-alert>`,
  ],
  invalid: [
    {
      code: `<sky-label>Foo <sky-help-inline helpKey="foo" /></sky-label>`,
      errors: [
        {
          messageId,
          data: { element: 'sky-label' },
          line: 1,
          column: 16,
          endColumn: 49,
        },
      ],
    },
    {
      code: `<sky-alert alertType="info">Foo <sky-help-inline helpKey="foo"></sky-help-inline></sky-alert>`,
      errors: [{ messageId, data: { element: 'sky-alert' } }],
    },
    {
      code: `<sky-tokens><sky-token><span>Foo <sky-help-inline helpKey="foo" /></span></sky-token></sky-tokens>`,
      errors: [{ messageId, data: { element: 'sky-token' } }],
    },
    {
      code: `<sky-alert><sky-label>Foo <sky-help-inline helpKey="foo" /></sky-label></sky-alert>`,
      errors: [{ messageId, data: { element: 'sky-alert' } }],
    },
    {
      code: `<sky-label>Foo @if (showHelp) { <sky-help-inline helpKey="foo" /> }</sky-label>`,
      errors: [{ messageId, data: { element: 'sky-label' } }],
    },
    {
      code: `<sky-label *ngIf="show">Foo <sky-help-inline helpKey="foo" /></sky-label>`,
      errors: [{ messageId, data: { element: 'sky-label' } }],
    },
  ],
});
