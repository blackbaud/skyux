import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import path from 'node:path';

describe('icons-name.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../../../migrations.json'),
  );

  const angularJson = {
    version: 1,
    projects: {
      test: {
        projectType: 'application',
        root: '',
        architect: {},
      },
    },
  };

  it('should handle valid templates', async () => {
    const tree = Tree.empty();

    const validTemplates = [
      `<sky-icon iconName="add"></sky-icon>`,
      `<sky-icon [iconName]="boundIcon"></sky-icon>`,
      `<sky-icon iconName="add" iconSize="s"></sky-icon>`,
      `<sky-icon iconName="add" variant="solid"></sky-icon>`,
      `<sky-icon iconName="add"/>`,
      `<sky-icon [iconName]="boundIcon"/>`,
      `<sky-icon iconName="add" iconSize="s"/>`,
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
    ];

    validTemplates.forEach((template, index) => {
      tree.create(`/valid-${index}.component.html`, template);
    });

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icon-name', {}, tree);

    validTemplates.forEach((template, index) => {
      expect(tree.readText(`/valid-${index}.component.html`)).toBe(template);
    });
  });

  it('should handle invalid templates', async () => {
    const tree = Tree.empty();

    const invalidTemplates = [
      {
        invalidTemplate: `
      <sky-icon icon="plus-circle"></sky-icon>
      `,
        convertedTemplate: `
      <sky-icon iconName="add"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="bb-diamond-2-solid"></sky-icon>
      `,
        convertedTemplate: `
      <sky-icon iconName="bb-diamond" variant="solid"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="bb-diamond-2-solid" variant="line"></sky-icon>
      `,
        convertedTemplate: `
      <sky-icon iconName="bb-diamond" variant="line"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="bb-diamond-2-solid" [variant]="iconVariant"></sky-icon>
      `,
        convertedTemplate: `
      <sky-icon iconName="bb-diamond" [variant]="iconVariant"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon [icon]="boundIcon"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="{{ boundIcon }}"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="cc"></sky-icon>
      `,
      },
      {
        invalidTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="trash" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
        convertedTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconName="delete" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      },
      {
        invalidTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon [iconType]="buttonIcon" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      },
      {
        invalidTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="{{ buttonIcon }}" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      },
      {
        invalidTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="cc" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      },
      {
        invalidTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconType="bb-diamond-2-solid" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
        convertedTemplate: `
      <sky-action-button-container>
        <sky-action-button (actionClick)="filterActionClick()">
          <sky-action-button-icon iconName="bb-diamond" />
          <sky-action-button-header> Delete a list </sky-action-button-header>
          <sky-action-button-details>
            Delete an existing list.
          </sky-action-button-details>
        </sky-action-button>
      </sky-action-button-container>
      `,
      },
      {
        invalidTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bold"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
        convertedTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          iconName="text-bold"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          [icon]="boundIcon"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="{{ boundIcon }}"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bold-heavy"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          icon="bb-diamond-2-solid"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
        convertedTemplate: `
      <sky-checkbox-group
        headingText="Text formatting"
        [formGroup]="formGroup"
        [headingHidden]="true"
        [stacked]="true"
      >
        <sky-checkbox
          formControlName="bold"
          iconName="bb-diamond"
          labelHidden="true"
          labelText="Bold"
        />
      </sky-checkbox-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="book"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
        convertedTemplate: `
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
      </sky-radio-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          [icon]="boundIcon"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="{{ boundIcon }}"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="cc"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="bb-diamond-2-solid"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
        convertedTemplate: `
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          iconName="bb-diamond"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      },
      {
        invalidTemplate: `
      <sky-icon icon="bb-diamond-2-solid" [variant]="iconVariant"></sky-icon>
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          icon="bb-diamond-2-solid"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
        convertedTemplate: `
      <sky-icon iconName="bb-diamond" [variant]="iconVariant"></sky-icon>
      <sky-radio-group
        class="sky-switch-icon-group"
        formControlName="myView"
        headingHidden="true"
        headingText="View"
      >
        <sky-radio
          iconName="bb-diamond"
          labelText="Test radio 1"
          value="0"
        />
      </sky-radio-group>
      `,
      },
    ];

    invalidTemplates.forEach((invalidTemplate, index) => {
      tree.create(
        `/invalid-${index}.component.html`,
        invalidTemplate.invalidTemplate,
      );
    });

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icon-name', {}, tree);

    invalidTemplates.forEach((invalidTemplate, index) => {
      expect(tree.readText(`/invalid-${index}.component.html`)).toBe(
        invalidTemplate.convertedTemplate ?? invalidTemplate.invalidTemplate,
      );
    });
  });

  it('should handle HTML in component files', async () => {
    const tree = Tree.empty();

    tree.create(
      `/icon-component.component.ts`,
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-icon icon="plus-circle"></sky-icon>'
})
export class IconComponentComponent {}`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icon-name', {}, tree);

    expect(tree.readText('/icon-component.component.ts')).toBe(
      `import { Component } from '@angular/core';

@Component({
  template: '<sky-icon iconName="add"></sky-icon>'
})
export class IconComponentComponent {}`,
    );
  });

  it('should handle HTML with no sky-icon elements', async () => {
    const tree = Tree.empty();

    tree.create(
      `/no-icon.component.html`,
      `<sky-alert>I have no icon.</sky-alert>`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icon-name', {}, tree);

    expect(tree.readText('/no-icon.component.html')).toBe(
      `<sky-alert>I have no icon.</sky-alert>`,
    );
  });

  it('should ignore files that do not contain Angular templates', async () => {
    const tree = Tree.empty();

    tree.create(
      `/not-a-template.txt`,
      `<sky-icon icon="plus-circle"></sky-icon>`,
    );

    tree.create('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic('icon-name', {}, tree);

    expect(tree.readText('/not-a-template.txt')).toBe(
      `<sky-icon icon="plus-circle"></sky-icon>`,
    );
  });
});
