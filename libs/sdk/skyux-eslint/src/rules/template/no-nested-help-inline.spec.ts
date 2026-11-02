import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import {
  RULE_NAME,
  messageId,
  rule,
  suggestMessageId,
} from './no-nested-help-inline';

const ruleTester = createTemplateRuleTester();

function errorWithSuggestion(
  element: string,
  output: string,
): Record<string, unknown> {
  return {
    messageId,
    data: { element },
    suggestions: [{ messageId: suggestMessageId, data: { element }, output }],
  };
}

function errorWithoutSuggestion(element: string): Record<string, unknown> {
  return { messageId, data: { element }, suggestions: [] };
}

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
      output: `<sky-label>Foo </sky-label><sky-help-inline helpKey="foo" />`,
      errors: [
        {
          ...errorWithoutSuggestion('sky-label'),
          line: 1,
          column: 16,
          endColumn: 49,
        },
      ],
    },
    {
      code: `<sky-alert alertType="info">Foo <sky-help-inline helpKey="foo"></sky-help-inline></sky-alert>`,
      output: `<sky-alert alertType="info">Foo </sky-alert><sky-help-inline helpKey="foo"></sky-help-inline>`,
      errors: [errorWithoutSuggestion('sky-alert')],
    },
    {
      code: `<sky-alert [closeable]="false">Foo <sky-help-inline helpKey="foo" /></sky-alert>`,
      output: `<sky-alert [closeable]="false">Foo </sky-alert><sky-help-inline helpKey="foo" />`,
      errors: [errorWithoutSuggestion('sky-alert')],
    },
    {
      code: `<sky-alert [closeable]="isCloseable">Foo <sky-help-inline helpKey="foo" /></sky-alert>`,
      errors: [
        errorWithSuggestion(
          'sky-alert',
          `<sky-alert [closeable]="isCloseable">Foo </sky-alert><sky-help-inline helpKey="foo" />`,
        ),
      ],
    },
    {
      code: `<sky-alert closeable="false">Foo <sky-help-inline helpKey="foo" /></sky-alert>`,
      errors: [
        errorWithSuggestion(
          'sky-alert',
          `<sky-alert closeable="false">Foo </sky-alert><sky-help-inline helpKey="foo" />`,
        ),
      ],
    },
    {
      code: `<sky-tokens><sky-token><span>Foo <sky-help-inline helpKey="foo" /></span></sky-token></sky-tokens>`,
      errors: [
        errorWithSuggestion(
          'sky-token',
          `<sky-tokens><sky-token><span>Foo </span></sky-token><sky-help-inline helpKey="foo" /></sky-tokens>`,
        ),
      ],
    },
    {
      code: `<sky-alert><sky-label>Foo <sky-help-inline helpKey="foo" /></sky-label></sky-alert>`,
      output: `<sky-alert><sky-label>Foo </sky-label></sky-alert><sky-help-inline helpKey="foo" />`,
      errors: [errorWithoutSuggestion('sky-alert')],
    },
    {
      code: `@if (show) { <sky-label>Foo <sky-help-inline helpKey="foo" /></sky-label> }`,
      output: `@if (show) { <sky-label>Foo </sky-label><sky-help-inline helpKey="foo" /> }`,
      errors: [errorWithoutSuggestion('sky-label')],
    },
    {
      code: `<sky-label>Foo @if (showHelp) { <sky-help-inline helpKey="foo" /> }</sky-label>`,
      errors: [errorWithoutSuggestion('sky-label')],
    },
    {
      code: `<sky-label>Foo <sky-help-inline *ngIf="showHelp" helpKey="foo" /></sky-label>`,
      errors: [errorWithoutSuggestion('sky-label')],
    },
    {
      code: `<sky-label *ngIf="show">Foo <sky-help-inline helpKey="foo" /></sky-label>`,
      errors: [errorWithoutSuggestion('sky-label')],
    },
    {
      code: `<sky-token *ngFor="let t of items">{{ t }} <sky-help-inline [helpKey]="t.key" /></sky-token>`,
      errors: [errorWithoutSuggestion('sky-token')],
    },
  ],
});
