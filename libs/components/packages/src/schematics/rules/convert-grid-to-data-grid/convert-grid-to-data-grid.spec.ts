import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { firstValueFrom } from 'rxjs';

import { createTestApp } from '../../testing/scaffold';

import { convertGridToDataGrid } from './convert-grid-to-data-grid';

describe('Convert Grid to Data Grid', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should convert grid to data-grid', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-grid [data]="data">
        <sky-grid-column field="field1" heading="Field 1" />
        <sky-grid-column field="field2" heading="Field 2">
          <ng-template><em>{{ value }}</em></ng-template>
        </sky-grid-column>
        <sky-grid-column field="field3" heading="Field 3" [hidden]="true" />
      </sky-grid>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column field="field1" headingText="Field 1" />
        <sky-data-grid-column field="field2" headingText="Field 2">
          <ng-template><em>{{ value }}</em></ng-template>
        </sky-data-grid-column>
        <sky-data-grid-column field="field3" headingText="Field 3" [hidden]="true" />
      </sky-data-grid>
    `;
    await firstValueFrom(runner.callRule(convertGridToDataGrid(''), tree));
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });

  it('should do nothing', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    tree.create('src/app/test.component.html', '<sky-grid');
    await firstValueFrom(runner.callRule(convertGridToDataGrid(''), tree));
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      '<sky-grid',
    );
  });

  it('should convert inline template', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-grid [data]="data">
            <sky-grid-column field="field1" />
            <sky-grid-column field="field2">
              <ng-template><em>{{ value }}</em></ng-template>
            </sky-grid-column>
            <sky-grid-column field="field3" alignment="center" />
          </sky-grid>
        ${backtick},
        imports: [SkyGridModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const output = stripIndents`
      import { Component } from '@angular/core';

      import { SkyDataGridModule } from '@skyux/data-grid';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-data-grid [data]="data">
            <sky-data-grid-column field="field1" />
            <sky-data-grid-column field="field2">
              <ng-template><em>{{ value }}</em></ng-template>
            </sky-data-grid-column>
            <sky-data-grid-column field="field3" />
          </sky-data-grid>
        ${backtick},
        imports: [SkyDataGridModule],
      })
      export class TestComponent {}
    `;
    await firstValueFrom(runner.callRule(convertGridToDataGrid(''), tree));
    expect(stripIndents`${tree.readText('src/app/test.component.ts')}`).toBe(
      output,
    );
  });

  it('should convert grid to data-grid', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'test-app',
    });
    const input = stripIndents`
      <sky-grid [data]="data" [enableMultiselect]="true" (sortFieldChange)="sort($event)" settingsKey="settingsKey">
        <sky-grid-column id="field1" />
        <sky-grid-column [id]="'field2'">
          <ng-template><em>{{ value }}</em></ng-template>
        </sky-grid-column>
        <sky-grid-column field="field3" />
      </sky-grid>
    `;
    tree.create('src/app/test.component.html', input);
    const output = stripIndents`
      <sky-data-grid [data]="data" [multiselect]="true">
        <sky-data-grid-column columnId="field1" />
        <sky-data-grid-column [columnId]="'field2'">
          <ng-template><em>{{ value }}</em></ng-template>
        </sky-data-grid-column>
        <sky-data-grid-column field="field3" />
      </sky-data-grid>
    `;
    await firstValueFrom(runner.callRule(convertGridToDataGrid(''), tree));
    expect(stripIndents`${tree.readText('src/app/test.component.html')}`).toBe(
      output,
    );
  });
});
