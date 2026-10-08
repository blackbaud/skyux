import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../testing/scaffold';

describe('Convert Grid to Data Grid', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  const logs: { level: string; message: string }[] = [];

  beforeAll(() => {
    runner.logger.subscribe((entry) => {
      logs.push({ level: entry.level, message: entry.message });
    });
  });

  beforeEach(() => {
    logs.length = 0;
  });

  function hasLog(substring: string): boolean {
    return logs.some((log) => log.message.includes(substring));
  }

  async function convert(tree: UnitTestTree): Promise<UnitTestTree> {
    return await runner.runSchematic(
      'convert-grid-to-data-grid',
      { project: 'test-app' },
      tree,
    );
  }

  it('should convert grid and column tags and rename inputs', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const input = stripIndents`
      <sky-grid [data]="data" [enableMultiselect]="true" [selectedRowIds]="ids" [sortField]="sort" (sortFieldChange)="onSort($event)">
        <sky-grid-column id="name" heading="Name" field="name" [isSortable]="true" [width]="200" [hidden]="false" />
      </sky-grid>
    `;
    tree.create('src/app/test.component.html', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data" [multiselect]="true" [selectedRowIds]="ids" [sort]="sort" (sortChange)="onSort($event)">
        <sky-data-grid-column columnId="name" headingText="Name" field="name" [sortable]="true" [width]="200" [columnHidden]="false" />
      </sky-data-grid>
    `);
    expect(hasLog('"sortField"/"(sortFieldChange)" bindings')).toBe(true);
    expect(hasLog('typed as SkyDataGridRowData[]')).toBe(true);
  });

  it('should translate fit literal values and warn on a bound fit', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data1" fit="scroll"></sky-grid>
        <sky-grid [data]="data2" fit="width"></sky-grid>
        <sky-grid [data]="data3" [fit]="fitValue"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data1" columnFit="content"></sky-data-grid>
      <sky-data-grid [data]="data2" columnFit="container"></sky-data-grid>
      <sky-data-grid [data]="data3" [columnFit]="fitValue"></sky-data-grid>
    `);
    expect(hasLog('"fit" input on <sky-grid> was renamed')).toBe(true);
  });

  it('should rename the multiselectSelectionChange output and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data" (multiselectSelectionChange)="onSelect($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data" (selectedRowIdsChange)="onSelect($event)"></sky-data-grid>
    `);
    expect(hasLog('"(multiselectSelectionChange)" output')).toBe(true);
  });

  it('should drop unsupported grid inputs and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data" hasToolbar="true" [height]="300" highlightText="x" [messageStream]="ms" multiselectRowId="key" [rowHighlightedId]="rid" settingsKey="grid1" [width]="500" (columnWidthChange)="onW($event)" (rowDeleteCancel)="onCancel($event)" (rowDeleteConfirm)="onConfirm($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data"></sky-data-grid>
    `);
    expect(hasLog('"hasToolbar" binding')).toBe(true);
    expect(hasLog('"settingsKey" binding')).toBe(true);
    expect(hasLog('"columnWidthChange" binding')).toBe(true);
    expect(hasLog('"rowDeleteCancel" binding')).toBe(true);
    expect(hasLog('"rowDeleteConfirm" binding')).toBe(true);
  });

  it('should keep the selected column ID bindings', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data" [selectedColumnIds]="cols" (selectedColumnIdsChange)="onCols($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data" [selectedColumnIds]="cols" (selectedColumnIdsChange)="onCols($event)"></sky-data-grid>
    `);
    expect(hasLog('"selectedColumnIds" binding')).toBe(false);
  });

  it('should map description to helpPopoverContent and drop other column inputs', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column field="amount" heading="Amount" description="The gift amount" alignment="right" [excludeFromHighlighting]="true" [search]="searchFn" type="number"></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column field="amount" headingText="Amount" helpPopoverContent="The gift amount"></sky-data-grid-column>
      </sky-data-grid>
    `);
    expect(hasLog('"description" input on <sky-grid-column> was mapped')).toBe(
      true,
    );
    expect(hasLog('For right alignment, set dataType="number"')).toBe(true);
    expect(hasLog('"excludeFromHighlighting" binding')).toBe(true);
    expect(hasLog('"search" binding')).toBe(true);
    expect(hasLog('"type" binding')).toBe(true);
  });

  it('should map inlineHelpPopover, drop description when both present, and drop non-right alignment', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column field="a" heading="A" [inlineHelpPopover]="helpTmpl" description="desc" alignment="center" />
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column field="a" headingText="A" [helpPopoverContent]="helpTmpl" />
      </sky-data-grid>
    `);
    expect(
      hasLog('"inlineHelpPopover" input on <sky-grid-column> was mapped'),
    ).toBe(true);
    expect(
      hasLog('"description" input on <sky-grid-column> could not be migrated'),
    ).toBe(true);
    expect(hasLog('Apply alignment via a cell template or CSS')).toBe(true);
  });

  it('should map inlineHelpPopover without a description and drop bound alignment', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column field="a" heading="A" [inlineHelpPopover]="tmpl" [alignment]="al"></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column field="a" headingText="A" [helpPopoverContent]="tmpl"></sky-data-grid-column>
      </sky-data-grid>
    `);
  });

  it('should leave a grid using the columns input unchanged and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const input = stripIndents`
      <sky-grid [data]="data" [columns]="myColumns">
        <sky-grid-column field="a" heading="A"></sky-grid-column>
      </sky-grid>
    `;
    tree.create('src/app/test.component.html', input);
    const result = await convert(tree);
    expect(
      stripIndents`${result.readText('src/app/test.component.html')}`,
    ).toBe(input);
    expect(hasLog('using the "columns" input was left unchanged')).toBe(true);
  });

  it('should leave a sky-grid-column nested in sky-list-view-grid unchanged and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const input = stripIndents`
      <sky-list-view-grid>
        <sky-grid-column field="a" heading="A"></sky-grid-column>
      </sky-list-view-grid>
    `;
    tree.create('src/app/test.component.html', input);
    const result = await convert(tree);
    expect(
      stripIndents`${result.readText('src/app/test.component.html')}`,
    ).toBe(input);
    expect(hasLog('inside <sky-list-view-grid> was left unchanged')).toBe(true);
  });

  it('should convert a standalone grid while leaving a sky-list-view-grid block untouched', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="a" heading="A" />
        </sky-grid>
        <sky-list-view-grid>
          <sky-grid-column field="b" heading="B"></sky-grid-column>
        </sky-list-view-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column columnId="a" headingText="A" />
      </sky-data-grid>
      <sky-list-view-grid>
        <sky-grid-column field="b" heading="B"></sky-grid-column>
      </sky-list-view-grid>
    `);
  });

  it('should convert multiple self-closing columns', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="a" heading="A" />
          <sky-grid-column id="b" heading="B" />
          <sky-grid-column id="c" heading="C" />
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column columnId="a" headingText="A" />
        <sky-data-grid-column columnId="b" headingText="B" />
        <sky-data-grid-column columnId="c" headingText="C" />
      </sky-data-grid>
    `);
  });

  it('should convert tags that have no attributes', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid>
          <sky-grid-column></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid>
        <sky-data-grid-column></sky-data-grid-column>
      </sky-data-grid>
    `);
  });

  it('should do nothing when there is no grid', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create('src/app/test.component.html', '<div>No grid here</div>');
    const result = await convert(tree);
    expect(result.readText('src/app/test.component.html')).toBe(
      '<div>No grid here</div>',
    );
  });

  it('should convert an inline template and swap the module import', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-grid [data]="data">
              <sky-grid-column id="name" heading="Name" field="name" />
            </sky-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-data-grid [data]="data">
              <sky-data-grid-column columnId="name" headingText="Name" field="name" />
            </sky-data-grid>
          ${backtick},
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should remove a redundant SkyGridModule import covered by SkyListViewGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-list-view-grid>
              <sky-grid-column field="name" heading="Name"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-list-view-grid>
              <sky-grid-column field="name" heading="Name"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should leave SkyGridModule unchanged and warn when SkyListViewGridModule cannot be confirmed', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-list-view-grid>
            <sky-grid-column field="name" heading="Name"></sky-grid-column>
          </sky-list-view-grid>
        ${backtick},
        imports: [SkyGridModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      input,
    );
    expect(hasLog('review it manually')).toBe(true);
  });

  it('should convert a real grid and remove the redundant SkyGridModule import in the same file', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-grid [data]="data">
              <sky-grid-column id="name" heading="Name" field="name" />
            </sky-grid>
            <sky-list-view-grid>
              <sky-grid-column field="b" heading="B"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-data-grid [data]="data">
              <sky-data-grid-column columnId="name" headingText="Name" field="name" />
            </sky-data-grid>
            <sky-list-view-grid>
              <sky-grid-column field="b" heading="B"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyDataGrid, SkyDataGridColumn, SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should convert a real grid even when a list-view-grid skip cannot confirm SkyListViewGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-grid [data]="data">
              <sky-grid-column id="name" heading="Name" field="name" />
            </sky-grid>
            <sky-list-view-grid>
              <sky-grid-column field="b" heading="B"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-data-grid [data]="data">
              <sky-data-grid-column columnId="name" headingText="Name" field="name" />
            </sky-data-grid>
            <sky-list-view-grid>
              <sky-grid-column field="b" heading="B"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should not touch imports when only SkyListViewGridModule is imported', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-list-view-grid>
            <sky-grid-column field="name" heading="Name"></sky-grid-column>
          </sky-list-view-grid>
        ${backtick},
        imports: [SkyListViewGridModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      input,
    );
  });

  function createExternalTemplateComponent(
    tree: UnitTestTree,
    name: string,
    className: string,
  ): void {
    tree.create(
      `src/app/${name}.component.ts`,
      stripIndents`
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-${name}',
          templateUrl: './${name}.component.html',
          standalone: false,
        })
        export class ${className} {}
      `,
    );
  }

  const listViewGridHtml = stripIndents`
    <sky-list-view-grid>
      <sky-grid-column field="name" heading="Name"></sky-grid-column>
    </sky-list-view-grid>
  `;

  it('should remove a redundant SkyGridModule import from an NgModule whose declared component only uses list-view-grid in an external template', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create('src/app/foo.component.html', listViewGridHtml);
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.component.html')}`).toBe(
      listViewGridHtml,
    );
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';

        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyListViewGridModule],
        })
        export class FooModule {}
      `,
    );
  });

  it('should leave an NgModule unchanged when list-view-grid usage cannot confirm SkyListViewGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create('src/app/foo.component.html', listViewGridHtml);
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    const moduleInput = stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      import { FooComponent } from './foo.component';

      @NgModule({
        declarations: [FooComponent],
        imports: [SkyGridModule],
      })
      export class FooModule {}
    `;
    tree.create('src/app/foo.module.ts', moduleInput);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.component.html')}`).toBe(
      listViewGridHtml,
    );
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      moduleInput,
    );
    // The warning for this case was already consumed by an earlier test:
    // logOnce dedupes messages across the whole suite, so this test can only
    // assert file contents.
  });

  it('should swap the SkyGridModule import in an NgModule whose declared component converts an external template', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/foo.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid [data]="data">
        <sky-data-grid-column columnId="name" headingText="Name" field="name" />
      </sky-data-grid>
    `);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';


        import { FooComponent } from './foo.component';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class FooModule {}
      `,
    );
    expect(result.readText('package.json')).toContain('@skyux/data-grid');
  });

  it('should remove a redundant SkyGridModule import from a standalone component with an external template', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create('src/app/test.component.html', listViewGridHtml);
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          templateUrl: './test.component.html',
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          templateUrl: './test.component.html',
          imports: [SkyListViewGridModule],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should swap the import in a standalone component whose external template converts', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          templateUrl: './test.component.html',
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          templateUrl: './test.component.html',
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should swap the import in a spec file referencing a converted component', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/foo.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-foo',
          template: ${backtick}
            <sky-grid [data]="data">
              <sky-grid-column id="name" heading="Name" field="name" />
            </sky-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class FooComponent {}
      `,
    );
    tree.create(
      'src/app/foo.component.spec.ts',
      stripIndents`
        import { TestBed } from '@angular/core/testing';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        describe('FooComponent', () => {
          beforeEach(() => {
            TestBed.configureTestingModule({
              imports: [SkyGridModule, FooComponent],
            });
          });
        });
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.component.spec.ts')}`)
      .toBe(stripIndents`
      import { TestBed } from '@angular/core/testing';


      import { FooComponent } from './foo.component';
      import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

      describe('FooComponent', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyDataGrid, SkyDataGridColumn, FooComponent],
          });
        });
      });
    `);
  });

  it('should keep the SkyGridModule import when the only grid uses the columns input', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    const input = stripIndents`
      import { Component } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      @Component({
        selector: 'app-test',
        template: ${backtick}
          <sky-grid [data]="data" [columns]="cols"></sky-grid>
        ${backtick},
        imports: [SkyGridModule],
      })
      export class TestComponent {}
    `;
    tree.create('src/app/test.component.ts', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      input,
    );
    expect(
      hasLog('Migrate that grid manually before removing the import'),
    ).toBe(true);
  });

  it('should swap the import but warn when a converted grid and a columns-input grid share a file', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-grid [data]="a">
              <sky-grid-column id="x" heading="X" />
            </sky-grid>
            <sky-grid [data]="b" [columns]="cols"></sky-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';

        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            <sky-data-grid [data]="a">
              <sky-data-grid-column columnId="x" headingText="X" />
            </sky-data-grid>
            <sky-grid [data]="b" [columns]="cols"></sky-grid>
          ${backtick},
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
    expect(
      hasLog(
        'Restore the import or complete the manual migration of that grid',
      ),
    ).toBe(true);
  });

  it('should swap the import in an NgModule mixing converted and list-view-grid components', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/a.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'a', 'AComponent');
    tree.create('src/app/b.component.html', listViewGridHtml);
    createExternalTemplateComponent(tree, 'b', 'BComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { AComponent } from './a.component';
        import { BComponent } from './b.component';

        @NgModule({
          declarations: [AComponent, BComponent],
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/b.component.html')}`).toBe(
      listViewGridHtml,
    );
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';

        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { AComponent } from './a.component';
        import { BComponent } from './b.component';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @NgModule({
          declarations: [AComponent, BComponent],
          imports: [SkyDataGrid, SkyDataGridColumn, SkyListViewGridModule],
        })
        export class FooModule {}
      `,
    );
  });

  it('should leave a file that mentions SkyGridModule without importing it unchanged', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const input = stripIndents`
      export { SkyGridModule } from '@skyux/grids';
    `;
    tree.create('src/app/index.ts', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/index.ts')}`).toBe(input);
  });

  it('should keep a redundant SkyGridModule import referenced in a TestBed configuration and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const backtick = '`';
    tree.create(
      'src/app/foo.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-foo',
          template: ${backtick}
            <sky-list-view-grid>
              <sky-grid-column field="name" heading="Name"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyListViewGridModule],
        })
        export class FooComponent {}
      `,
    );
    const specInput = stripIndents`
      import { TestBed } from '@angular/core/testing';
      import { SkyGridModule } from '@skyux/grids';
      import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

      import { FooComponent } from './foo.component';

      describe('FooComponent', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyGridModule, SkyListViewGridModule, FooComponent],
          });
        });
      });
    `;
    tree.create('src/app/foo.component.spec.ts', specInput);
    const result = await convert(tree);
    expect(
      stripIndents`${result.readText('src/app/foo.component.spec.ts')}`,
    ).toBe(specInput);
    expect(hasLog('remove the import manually if nothing else needs it')).toBe(
      true,
    );
  });

  it('should leave a module with no associated grid usage unchanged and warn', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    const input = stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      @NgModule({
        exports: [SkyGridModule],
      })
      export class SharedGridModule {}
    `;
    tree.create('src/app/shared-grid.module.ts', input);
    const result = await convert(tree);
    expect(
      stripIndents`${result.readText('src/app/shared-grid.module.ts')}`,
    ).toBe(input);
    expect(
      hasLog('no <sky-grid> usage associated with this file was converted'),
    ).toBe(true);
    expect(result.readText('package.json')).not.toContain('@skyux/data-grid');
  });

  it('should add SkyDataGrid and SkyDataGridColumn to an NgModule imports array when only exports referenced SkyGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/foo.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          exports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    const moduleOutput = result.readText('src/app/foo.module.ts');
    expect(moduleOutput).toContain('exports: [SkyDataGrid, SkyDataGridColumn]');
    expect(moduleOutput).toMatch(
      /imports: \[\s*SkyDataGrid, SkyDataGridColumn\s*\]/,
    );
  });

  it('should append SkyDataGrid and SkyDataGridColumn to an existing NgModule imports array when only exports referenced SkyGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/foo.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { CommonModule } from '@angular/common';
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [CommonModule],
          exports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { CommonModule } from '@angular/common';
        import { NgModule } from '@angular/core';


        import { FooComponent } from './foo.component';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @NgModule({
          declarations: [FooComponent],
          imports: [CommonModule, SkyDataGrid, SkyDataGridColumn],
          exports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class FooModule {}
      `,
    );
  });

  it('should only add SkyDataGrid and SkyDataGridColumn to the NgModule that exports SkyGridModule without importing it, when a file declares multiple NgModules', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/foo.component.html',
      stripIndents`
        <sky-grid [data]="data">
          <sky-grid-column id="name" heading="Name" field="name" />
        </sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyGridModule],
          exports: [SkyGridModule],
        })
        export class FooModule {}

        @NgModule({
          exports: [SkyGridModule],
        })
        export class BarModule {}
      `,
    );
    const result = await convert(tree);
    const moduleOutput = result.readText('src/app/foo.module.ts');

    // FooModule already imported SkyGridModule, so swapImportedClass alone
    // handles it; it must not receive a second, duplicate imports edit.
    const fooModuleBlock = moduleOutput.match(
      /@NgModule\({[^{}]*}\)\s*export class FooModule \{\}/,
    )?.[0];
    expect(fooModuleBlock).toBeDefined();
    expect(fooModuleBlock).toContain(
      'imports: [SkyDataGrid, SkyDataGridColumn]',
    );
    expect(fooModuleBlock).toContain(
      'exports: [SkyDataGrid, SkyDataGridColumn]',
    );
    expect(
      fooModuleBlock?.match(/SkyDataGrid, SkyDataGridColumn/g),
    ).toHaveLength(2);

    // BarModule only exported SkyGridModule, so it needs the imports array added.
    const barModuleBlock = moduleOutput.match(
      /@NgModule\({[^{}]*}\)\s*export class BarModule \{\}/,
    )?.[0];
    expect(barModuleBlock).toBeDefined();
    expect(barModuleBlock).toContain(
      'exports: [SkyDataGrid, SkyDataGridColumn]',
    );
    expect(
      barModuleBlock?.match(/SkyDataGrid, SkyDataGridColumn/g),
    ).toHaveLength(2);
  });
});
