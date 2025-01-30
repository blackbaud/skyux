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
    `
    <sky-checkbox-group
      headingText="Text formatting"
      [formGroup]="formGroup"
      [headingHidden]="true"
      [stacked]="true"
    >
      <sky-checkbox
        formControlName="bold"
        iconName="text-bold-b"
        labelHidden="true"
        labelText="Bold"
      />
      <sky-checkbox
        formControlName="italic"
        iconName="text-italic-i"
        labelHidden="true"
        labelText="Italic"
      />
      <sky-checkbox
        formControlName="underline"
        iconName="text-underline-u"
        labelHidden="true"
        labelText="Underline"
      />
    </sky-checkbox-group>
    `,
    `
    <sky-radio-group
      class="sky-switch-icon-group"
      formControlName="myView"
      headingHidden="true"
      headingText="View"
    >
      <sky-radio
        iconName="book"
        labelText="Test radio 1"
        value="0"
      />
      <sky-radio
        iconName="flash"
        labelText="Test radio 2"
        value="1"
      />
    </sky-radio-group>
    `,
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
    convertAnnotatedSourceToFailureCase({
      description: 'checkbox - should fail if icon is hard coded',
      annotatedSource: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bold"
          ~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      annotatedOutput: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          iconName="text-bold"
          ~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'checkbox - should fail if icon is bound',
      annotatedSource: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          [icon]="boundIcon"
          ~~~~~~~~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'checkbox - should fail if icon is hard coded to a binding statement',
      annotatedSource: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="{{ boundIcon }}"
          ~~~~~~~~~~~~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'checkbox - should fail if icon is hard coded to an unknown icon',
      annotatedSource: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bold-heavy"
          ~~~~~~~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'checkbox - should fail if icon is hard coded and replacement has a variant (ignored)',
      annotatedSource: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bb-diamond-2-solid"
          ~~~~~~~~~~~~~~~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      annotatedOutput: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          iconName="bb-diamond"
          ~~~~~~~~~~~~~~~~~~~~~~~~~
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'radio - should fail if icon is hard coded',
      annotatedSource: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="book"
          ~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      annotatedOutput: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          iconName="book"
          ~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'radio - should fail if icon is bound',
      annotatedSource: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          [icon]="boundIcon"
          ~~~~~~~~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'radio - should fail if icon is hard coded to a binding statement',
      annotatedSource: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="{{ boundIcon }}"
          ~~~~~~~~~~~~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'radio - should fail if icon is hard coded to an unknown icon',
      annotatedSource: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="cc"
          ~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
    convertAnnotatedSourceToFailureCase({
      description:
        'radio - should fail if icon is hard coded and replacement has a variant (ignored)',
      annotatedSource: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="bb-diamond-2-solid"
          ~~~~~~~~~~~~~~~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      annotatedOutput: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          iconName="bb-diamond"
          ~~~~~~~~~~~~~~~~~~~~~~~~~
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      messageId,
      data: {},
    }),
  ],
});
