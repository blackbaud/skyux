import { convertAnnotatedSourceToFailureCase } from '@angular-eslint/test-utils';

import { createTemplateRuleTester } from '../testing/create-template-rule-tester';

import { RULE_NAME, messageId, rule } from './no-legacy-icons';

const ruleTester = createTemplateRuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `<sky-icon iconName="add"></sky-icon>`,
    `<sky-icon [iconName]="boundIcon"></sky-icon>`,
    `<sky-icon iconName="add" [fixedWidth]="true"></sky-icon>`,
    `<sky-icon iconName="add" size="2x"></sky-icon>`,
    `<sky-icon iconName="add" variant="solid"></sky-icon>`,
    `<sky-icon iconName="add"/>`,
    `<sky-icon [iconName]="boundIcon"/>`,
    `<sky-icon iconName="add" [fixedWidth]="true"/>`,
    `<sky-icon iconName="add" size="2x"/>`,
    `<sky-icon iconName="add" variant="solid"/>`,
    `<sky-action-button-container>
      <sky-action-button (actionClick)="filterActionClick()">
        <sky-action-button-icon iconName="delete" />
        <sky-action-button-header> Delete a list </sky-action-button-header>
        <sky-action-button-details>
          Delete an existing list.
        </sky-action-button-details>
      </sky-action-button>
    </sky-action-button-container>`,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'icon - should fail if icon is hard coded',
      annotatedSource: `
      <sky-icon icon="plus-circle"></sky-icon>
                ~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-icon iconName="add"></sky-icon>
                ~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'icon - should fail if icon is hard coded and replacement has a variant',
      annotatedSource: `
      <sky-icon icon="bb-diamond-2-solid"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-icon iconName="bb-diamond" variant="solid"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'icon - should fail if icon is hard coded and replacement has a variant but variant is already hard coded',
      annotatedSource: `
      <sky-icon icon="bb-diamond-2-solid" variant="line"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-icon iconName="bb-diamond" variant="line"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'icon - should fail if icon is hard coded and replacement has a variant but variant is already bound',
      annotatedSource: `
      <sky-icon icon="bb-diamond-2-solid" [variant]="iconVariant"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      annotatedOutput: `
      <sky-icon iconName="bb-diamond" [variant]="iconVariant"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'icon - should fail if icon is bound',
      annotatedSource: `
      <sky-icon [icon]="boundIcon"></sky-icon>
                ~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'icon - should fail if icon is hard coded to a binding statement',
      annotatedSource: `
      <sky-icon icon="{{ boundIcon }}"></sky-icon>
                ~~~~~~~~~~~~~~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'icon - should fail if icon is hard coded to an unknown icon',
      annotatedSource: `
      <sky-icon icon="cc"></sky-icon>
                ~~~~~~~~~
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'action-button - should fail if icon is hard coded',
      annotatedSource: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="trash" />
                                  ~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      annotatedOutput: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconName="delete" />
                                  ~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'action-button - should fail if icon is bound',
      annotatedSource: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon [iconType]="buttonIcon" />
                                  ~~~~~~~~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'action-button - should fail if icon is hard coded to a binding statement',
      annotatedSource: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="{{ buttonIcon }}" />
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'action-button - should fail if icon is hard coded to an unknown icon',
      annotatedSource: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="cc" />
                                  ~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'action-button - should fail if icon is hard coded and replacement has a variant (ignored)',
      annotatedSource: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="bb-diamond-2-solid" />
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      annotatedOutput: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconName="bb-diamond" />
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      messageId,
      data: {},
    }),
  ],
});
