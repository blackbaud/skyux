import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

import { convertDefinitionListToDescriptionList } from './convert-definition-list-to-description-list';

describe('Convert Definition List to Description List', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should convert definition list to description list', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-definition-list
        *ngIf="true"
        class="test-class"
        data-sky-id="test-id"
        defaultValue="Shrug."
        directiveExample
      >
        <sky-definition-list-content *ngIf="true">
          <sky-definition-list-label class="test-label">Label 1</sky-definition-list-label>
          <sky-definition-list-value directiveExample>Value 1</sky-definition-list-value>
        </sky-definition-list-content>
        @if (true) {
          <sky-definition-list-content>
            <sky-definition-list-label>Label 2</sky-definition-list-label>
            <sky-definition-list-value>Value 2</sky-definition-list-value>
          </sky-definition-list-content>
        }
      </sky-definition-list>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-description-list mode="longDescription" *ngIf="true" class="test-class" data-sky-id="test-id" defaultDescription="Shrug." directiveExample>
        <sky-description-list-content *ngIf="true">
          <sky-description-list-term class="test-label">Label 1</sky-description-list-term>
          <sky-description-list-description directiveExample>Value 1</sky-description-list-description>
        </sky-description-list-content>
        @if (true) {
          <sky-description-list-content>
            <sky-description-list-term>Label 2</sky-description-list-term>
            <sky-description-list-description>Value 2</sky-description-list-description>
          </sky-description-list-content>
        }
      </sky-description-list>
    `;
    await firstValueFrom(
      runner.callRule(convertDefinitionListToDescriptionList(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create('src/app/test.component.html', '<sky-definition-list');
    await firstValueFrom(
      runner.callRule(convertDefinitionListToDescriptionList(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      '<sky-definition-list',
    );
  });

  it('should convert definition list to description list with header', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-definition-list [defaultValue]="null" [labelWidth]="10">
        <sky-definition-list-heading>
          <!-- This is a comment -->
          <em>Heading</em>
        </sky-definition-list-heading>
        <sky-definition-list-content>
          <sky-definition-list-label>Label 1</sky-definition-list-label>
          <sky-definition-list-value>Value 1</sky-definition-list-value>
        </sky-definition-list-content>
        <sky-definition-list-content>
          <sky-definition-list-label>Label 2</sky-definition-list-label>
          <sky-definition-list-value>Value 2</sky-definition-list-value>
        </sky-definition-list-content>
      </sky-definition-list>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <h3>
        <!-- This is a comment -->
        <em>Heading</em>
      </h3>
      <sky-description-list mode="longDescription" [defaultDescription]="null">

        <sky-description-list-content>
          <sky-description-list-term>Label 1</sky-description-list-term>
          <sky-description-list-description>Value 1</sky-description-list-description>
        </sky-description-list-content>
        <sky-description-list-content>
          <sky-description-list-term>Label 2</sky-description-list-term>
          <sky-description-list-description>Value 2</sky-description-list-description>
        </sky-description-list-content>
      </sky-description-list>
    `;
    await firstValueFrom(
      runner.callRule(convertDefinitionListToDescriptionList(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should convert inline template', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyDefinitionListModule } from '@skyux/layout';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-definition-list>
            <sky-definition-list-heading>Heading</sky-definition-list-heading>
            <sky-definition-list-content>
              <sky-definition-list-label>Label 1</sky-definition-list-label>
              <sky-definition-list-value>Value 1</sky-definition-list-value>
            </sky-definition-list-content>
            <sky-definition-list-content>
              <sky-definition-list-label>Label 2</sky-definition-list-label>
              <sky-definition-list-value>Value 2</sky-definition-list-value>
            </sky-definition-list-content>
          </sky-definition-list>
        ${backtick},
        imports: [SkyDefinitionListModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';
      import { SkyDescriptionListModule } from '@skyux/layout';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <h3>Heading</h3>
          <sky-description-list mode="longDescription">

            <sky-description-list-content>
              <sky-description-list-term>Label 1</sky-description-list-term>
              <sky-description-list-description>Value 1</sky-description-list-description>
            </sky-description-list-content>
            <sky-description-list-content>
              <sky-description-list-term>Label 2</sky-description-list-term>
              <sky-description-list-description>Value 2</sky-description-list-description>
            </sky-description-list-content>
          </sky-description-list>
        ${backtick},
        imports: [SkyDescriptionListModule],
      })
      export class TestComponent {}
    `;
    await firstValueFrom(
      runner.callRule(convertDefinitionListToDescriptionList(''), tree),
    );
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });
});
