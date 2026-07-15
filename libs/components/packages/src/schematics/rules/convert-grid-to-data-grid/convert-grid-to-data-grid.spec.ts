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
        <sky-grid [data]="data" hasToolbar="true" [height]="300" highlightText="x" [messageStream]="ms" multiselectRowId="key" [rowHighlightedId]="rid" [selectedColumnIds]="cols" (selectedColumnIdsChange)="onCols($event)" settingsKey="grid1" [width]="500" (columnWidthChange)="onW($event)" (rowDeleteCancel)="onCancel($event)" (rowDeleteConfirm)="onConfirm($event)"></sky-grid>
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
    expect(hasLog('"selectedColumnIdsChange" binding')).toBe(true);
    expect(hasLog('"rowDeleteCancel" binding')).toBe(true);
    expect(hasLog('"rowDeleteConfirm" binding')).toBe(true);
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
});
