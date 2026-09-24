import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-native-click';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-button (buttonClick)="save()">Save</sky-button>`,
    `<sky-action-button (actionClick)="onAction()"></sky-action-button>`,
    `<sky-filter-button (filterButtonClick)="onFilter()"></sky-filter-button>`,
    `<sky-progress-indicator-nav-button (actionClick)="onNav()"></sky-progress-indicator-nav-button>`,
    `<sky-progress-indicator-reset-button (resetClick)="onReset()"></sky-progress-indicator-reset-button>`,
    `<sky-summary-action-bar-primary-action (actionClick)="onAction()"></sky-summary-action-bar-primary-action>`,
    `<sky-summary-action-bar-secondary-action (actionClick)="onAction()"></sky-summary-action-bar-secondary-action>`,
    `<sky-summary-action-bar-cancel (actionClick)="onCancel()"></sky-summary-action-bar-cancel>`,
    `<sky-help-inline (actionClick)="onAction()"></sky-help-inline>`,
    `<button (click)="onClick()">Click me</button>`,
    // Components with multiple internal *Click outputs are intentionally excluded.
    `<sky-tile (click)="onClick()"></sky-tile>`,
    // A targeted event isn't a binding to the element's own click.
    `<sky-button (document:click)="onDocumentClick()"></sky-button>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'sky-button - should fail and autofix when $event is unused',
      annotatedSource: `
      <sky-button (click)="save()">Save</sky-button>
                  ~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-button (buttonClick)="save()">Save</sky-button>
                  ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-button', alternativeOutput: 'buttonClick' },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-button - should fail without autofix when the handler references $event',
      annotatedSource: `
      <sky-button (click)="save($event)">Save</sky-button>
                  ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-button', alternativeOutput: 'buttonClick' },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        "sky-button - should fail and autofix when '$event' only appears in a string literal",
      annotatedSource: `
      <sky-button (click)="log('$event fired')">Save</sky-button>
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-button (buttonClick)="log('$event fired')">Save</sky-button>
                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-button', alternativeOutput: 'buttonClick' },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-button - should fail without autofix when the alternative output is already bound',
      annotatedSource: `
      <sky-button (click)="save()" (buttonClick)="onButtonClick()">Save</sky-button>
                  ~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-button', alternativeOutput: 'buttonClick' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'sky-action-button - should fail and autofix',
      annotatedSource: `
      <sky-action-button (click)="onAction()"></sky-action-button>
                         ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-action-button (actionClick)="onAction()"></sky-action-button>
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-action-button', alternativeOutput: 'actionClick' },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'sky-filter-button - should fail and autofix',
      annotatedSource: `
      <sky-filter-button (click)="onFilter()"></sky-filter-button>
                         ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-filter-button (filterButtonClick)="onFilter()"></sky-filter-button>
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-filter-button',
        alternativeOutput: 'filterButtonClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-progress-indicator-nav-button - should fail and autofix',
      annotatedSource: `
      <sky-progress-indicator-nav-button (click)="onNav()"></sky-progress-indicator-nav-button>
                                         ~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-progress-indicator-nav-button (actionClick)="onNav()"></sky-progress-indicator-nav-button>
                                         ~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-progress-indicator-nav-button',
        alternativeOutput: 'actionClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-progress-indicator-reset-button - should fail and autofix',
      annotatedSource: `
      <sky-progress-indicator-reset-button (click)="onReset()"></sky-progress-indicator-reset-button>
                                           ~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-progress-indicator-reset-button (resetClick)="onReset()"></sky-progress-indicator-reset-button>
                                           ~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-progress-indicator-reset-button',
        alternativeOutput: 'resetClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-summary-action-bar-primary-action - should fail and autofix',
      annotatedSource: `
      <sky-summary-action-bar-primary-action (click)="onAction()"></sky-summary-action-bar-primary-action>
                                             ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-summary-action-bar-primary-action (actionClick)="onAction()"></sky-summary-action-bar-primary-action>
                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-summary-action-bar-primary-action',
        alternativeOutput: 'actionClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'sky-summary-action-bar-secondary-action - should fail and autofix',
      annotatedSource: `
      <sky-summary-action-bar-secondary-action (click)="onAction()"></sky-summary-action-bar-secondary-action>
                                               ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-summary-action-bar-secondary-action (actionClick)="onAction()"></sky-summary-action-bar-secondary-action>
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-summary-action-bar-secondary-action',
        alternativeOutput: 'actionClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'sky-summary-action-bar-cancel - should fail and autofix',
      annotatedSource: `
      <sky-summary-action-bar-cancel (click)="onCancel()"></sky-summary-action-bar-cancel>
                                     ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-summary-action-bar-cancel (actionClick)="onCancel()"></sky-summary-action-bar-cancel>
                                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {
        selector: 'sky-summary-action-bar-cancel',
        alternativeOutput: 'actionClick',
      },
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'sky-help-inline - should fail and autofix',
      annotatedSource: `
      <sky-help-inline (click)="onAction()"></sky-help-inline>
                       ~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-help-inline (actionClick)="onAction()"></sky-help-inline>
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: { selector: 'sky-help-inline', alternativeOutput: 'actionClick' },
    }),
  ],
});
