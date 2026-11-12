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

  function todo(message: string): string {
    return `<!-- TODO: data-grid-migration: ${message} -->`;
  }

  function importTodo(message: string): string {
    return `// TODO: data-grid-migration: ${message}`;
  }

  const dataTodo = todo(
    'Give every row in the array bound to <sky-data-grid> [data] a unique string "id" property (SkyDataGridRowData).',
  );

  const settingsKeyTodo = todo(
    "To persist the user's grid settings, host <sky-data-grid> in <sky-data-manager> and set settingsKey on the data manager. <sky-data-grid> has no settingsKey input.",
  );

  const otherAlignmentTodo = todo(
    'Recreate the former alignment of this <sky-data-grid-column> in a column template, or set dataType="number" to right-align numbers. <sky-data-grid-column> has no alignment input.',
  );

  const inlineHelpTodo = todo(
    'Bind a TemplateRef or string to <sky-data-grid-column> [helpPopoverContent], not a <sky-popover> reference: move the popover body into an <ng-template> and its popoverTitle to helpPopoverTitle.',
  );

  const listViewGridTodo = todo(
    'Migrate this <sky-list-view-grid> and its parent <sky-list> to <sky-data-manager> with a <sky-data-view> that contains a <sky-data-grid>, converting each <sky-grid-column> to <sky-data-grid-column>. See https://developer.blackbaud.com/skyux/components/data-manager',
  );

  const columnsInputTodo = todo(
    'Migrate this <sky-grid> manually: replace it with <sky-data-grid> and declare a <sky-data-grid-column> for each entry in its [columns] array. <sky-data-grid> has no columns input.',
  );

  const listViewGridModuleMissingTodo = importTodo(
    'Replace SkyGridModule with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid after migrating the <sky-list-view-grid> to <sky-data-manager>.',
  );

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
      ${todo('Convert the <sky-data-grid> [sort] value and (sortChange) handler from { fieldSelector, descending } to SkyDataGridSort: { field, direction: "asc" | "desc" }.')}
      ${dataTodo}
      <sky-data-grid [data]="data" [multiselect]="true" [selectedRowIds]="ids" [sort]="sort" (sortChange)="onSort($event)">
        <sky-data-grid-column columnId="name" headingText="Name" field="name" [sortable]="true" [width]="200" [columnHidden]="false" />
      </sky-data-grid>
    `);
    expect(hasLog('to SkyDataGridSort')).toBe(true);
    expect(hasLog('unique string "id" property')).toBe(true);
  });

  it('should translate fit literal values and add a TODO only for a bound or interpolated fit', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid fit="scroll"></sky-grid>
        <sky-grid fit="width"></sky-grid>
        <sky-grid [fit]="fitValue"></sky-grid>
        <sky-grid fit="{{ fitValue }}"></sky-grid>
      `,
    );
    const result = await convert(tree);
    const fitTodo = todo(
      'Change the value bound to <sky-data-grid> [columnFit] from "width" to "container" and from "scroll" to "content".',
    );
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid columnFit="content"></sky-data-grid>
      <sky-data-grid columnFit="container"></sky-data-grid>
      ${fitTodo}
      <sky-data-grid [columnFit]="fitValue"></sky-data-grid>
      ${fitTodo}
      <sky-data-grid columnFit="{{ fitValue }}"></sky-data-grid>
    `);
  });

  it('should add a TODO above each grid even though the warning is logged once', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid settingsKey="grid1"></sky-grid>
        <sky-grid settingsKey="grid2"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${settingsKeyTodo}
      <sky-data-grid></sky-data-grid>
      ${settingsKeyTodo}
      <sky-data-grid></sky-data-grid>
    `);
    expect(
      logs.filter((log) =>
        log.message.includes('set settingsKey on the data manager'),
      ),
    ).toHaveLength(1);
  });

  it('should rename the multiselectSelectionChange output and add a TODO', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid (multiselectSelectionChange)="onSelect($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Update the <sky-data-grid> (selectedRowIdsChange) handler: it receives a string[] of selected row IDs, not a SkyGridSelectedRowsModelChange object.')}
      <sky-data-grid (selectedRowIdsChange)="onSelect($event)"></sky-data-grid>
    `);
  });

  it('should drop unsupported grid inputs, keep row delete outputs, and add TODOs only where follow-up is needed', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid (rowDeleteCancel)="onCancel($event)" (rowDeleteConfirm)="onConfirm($event)" hasToolbar="true" [height]="300" highlightText="x" [messageStream]="ms" multiselectRowId="key" [rowHighlightedId]="rid" settingsKey="grid1" [width]="500" (columnWidthChange)="onW($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Restore the toolbar with the data manager: host <sky-data-grid> in a <sky-data-view> inside <sky-data-manager>, and move the toolbar content into <sky-data-manager-toolbar>. <sky-data-grid> has no hasToolbar input.')}
      ${todo('Constrain the <sky-data-grid> height through its container: it has no height input and grows to fit its rows. Set dock="fill" inside a fixed-size, positioned container, or set [minHeight] for a minimum.')}
      ${todo('Set the width on an element that wraps <sky-data-grid>: it has no width input and fills its container.')}
      ${todo('Move search-text highlighting to the data manager: host <sky-data-grid> in a <sky-data-view searchHighlightEnabled> inside <sky-data-manager>. <sky-data-grid> has no highlightText input.')}
      ${todo('Replace SkyGridMessage commands sent through messageStream with <sky-data-grid> bindings: for SelectAll set [(selectedRowIds)] to every row ID and for ClearAll set it to []; for PromptDeleteRow add the row ID to [(rowDeleteIds)] and for AbortDeleteRow remove it. <sky-data-grid> has no messageStream input.')}
      ${settingsKeyTodo}
      ${todo('Set each <sky-data-grid> row\'s "id" property to the value of its "key" property: rows and selectedRowIds are identified by "id", and there is no multiselectRowId input.')}
      ${todo('Highlight the row by binding <sky-data-grid> [selectedRowIds]="[rid]": selecting a single row highlights it, even without multiselect. <sky-data-grid> has no rowHighlightedId input.')}
      <sky-data-grid (rowDeleteCancel)="onCancel($event)" (rowDeleteConfirm)="onConfirm($event)"></sky-data-grid>
    `);
    expect(hasLog('Column width change events')).toBe(true);
  });

  it('should add a TODO to highlight a literal rowHighlightedId through selectedRowIds', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      '<sky-grid rowHighlightedId="5"></sky-grid>',
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Highlight the row by binding <sky-data-grid> [selectedRowIds]="[\'5\']": selecting a single row highlights it, even without multiselect. <sky-data-grid> has no rowHighlightedId input.')}
      <sky-data-grid></sky-data-grid>
    `);
  });

  it('should add a TODO to indicate the highlighted row another way when the grid uses multiselect', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      '<sky-grid [enableMultiselect]="true" [rowHighlightedId]="rid"></sky-grid>',
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Indicate the highlighted row another way, such as in a column template: <sky-data-grid> highlights a row by selecting it through [selectedRowIds], which this grid already uses for multiselect. <sky-data-grid> has no rowHighlightedId input.')}
      <sky-data-grid [multiselect]="true"></sky-data-grid>
    `);
  });

  it('should add a TODO to highlight through selectedRowIds when multiselect is bound to false', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      '<sky-grid [enableMultiselect]="false" [rowHighlightedId]="rid"></sky-grid>',
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Highlight the row by binding <sky-data-grid> [selectedRowIds]="[rid]": selecting a single row highlights it, even without multiselect. <sky-data-grid> has no rowHighlightedId input.')}
      <sky-data-grid [multiselect]="false"></sky-data-grid>
    `);
  });

  it('should add a TODO for a bound column type', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid>
          <sky-grid-column field="a" [type]="columnType"></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid>
        ${todo('Set dataType on this <sky-data-grid-column> to match the former [type] binding so its values sort and format correctly: <sky-data-grid-column> has no type input, and columns default to dataType="text".')}
        <sky-data-grid-column field="a"></sky-data-grid-column>
      </sky-data-grid>
    `);
  });

  it('should add a TODO for a bound multiselectRowId', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      '<sky-grid [multiselectRowId]="rowIdField"></sky-grid>',
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Set each <sky-data-grid> row\'s "id" property to the value of the property named by the former [multiselectRowId] binding: rows and selectedRowIds are identified by "id", and there is no multiselectRowId input.')}
      <sky-data-grid></sky-data-grid>
    `);
  });

  it('should keep the selected column ID bindings and add a TODO only when changes are bound', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid [(selectedColumnIds)]="cols"></sky-grid>
        <sky-grid [selectedColumnIds]="cols"></sky-grid>
        <sky-grid (selectedColumnIdsChange)="onChange($event)"></sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${todo('Initialize the property bound to <sky-data-grid> selectedColumnIds to an array of column IDs: selectedColumnIdsChange does not emit column reorders while selectedColumnIds is undefined.')}
      <sky-data-grid [(selectedColumnIds)]="cols"></sky-data-grid>
      <sky-data-grid [selectedColumnIds]="cols"></sky-data-grid>
      ${todo('Bind <sky-data-grid> [selectedColumnIds] to a property initialized to an array of column IDs: selectedColumnIdsChange does not emit column reorders while selectedColumnIds is undefined.')}
      <sky-data-grid (selectedColumnIdsChange)="onChange($event)"></sky-data-grid>
    `);
  });

  it('should keep description, add TODOs for right alignment, type, and search, and drop column inputs that need no follow-up', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid>
          <sky-grid-column field="amount" heading="Amount" description="The gift amount" alignment="right" [excludeFromHighlighting]="true" [search]="searchFn" type="number"></sky-grid-column>
          <sky-grid-column field="name" heading="Name" alignment="left"></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid>
        ${todo('Set dataType="number" on this <sky-data-grid-column> if it holds numbers, which right-aligns them; otherwise right-align the cell content in a column template. <sky-data-grid-column> has no alignment input.')}
        ${todo('Set dataType on this <sky-data-grid-column> to match its former type "number" so its values sort and format correctly: <sky-data-grid-column> has no type input, and columns default to dataType="text".')}
        ${todo("Restore this column's custom search with the data manager: host <sky-data-grid> in a <sky-data-view searchEnabled> inside <sky-data-manager>, and apply the search function when filtering [data] by the data manager's [(searchText)]. <sky-data-grid-column> has no search input.")}
        <sky-data-grid-column field="amount" headingText="Amount" description="The gift amount"></sky-data-grid-column>
        <sky-data-grid-column field="name" headingText="Name"></sky-data-grid-column>
      </sky-data-grid>
    `);
  });

  it('should map inlineHelpPopover alongside description and add a TODO for center alignment', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid>
          <sky-grid-column field="a" heading="A" [inlineHelpPopover]="helpPopover" description="desc" alignment="center" />
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid>
        ${inlineHelpTodo}
        ${otherAlignmentTodo}
        <sky-data-grid-column field="a" headingText="A" [helpPopoverContent]="helpPopover" description="desc" />
      </sky-data-grid>
    `);
  });

  it('should map inlineHelpPopover and add a TODO for bound alignment', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      stripIndents`
        <sky-grid>
          <sky-grid-column field="a" heading="A" [inlineHelpPopover]="helpPopover" [alignment]="al"></sky-grid-column>
        </sky-grid>
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      <sky-data-grid>
        ${inlineHelpTodo}
        ${otherAlignmentTodo}
        <sky-data-grid-column field="a" headingText="A" [helpPopoverContent]="helpPopover"></sky-data-grid-column>
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
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${columnsInputTodo}
      ${input}
    `);
    expect(hasLog('Migrate this <sky-grid> manually')).toBe(true);
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
    expect(stripIndents`${result.readText('src/app/test.component.html')}`)
      .toBe(stripIndents`
      ${listViewGridTodo}
      ${input}
    `);
    expect(hasLog('Migrate this <sky-list-view-grid>')).toBe(true);
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
      ${dataTodo}
      <sky-data-grid [data]="data">
        <sky-data-grid-column columnId="a" headingText="A" />
      </sky-data-grid>
      ${listViewGridTodo}
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
      ${dataTodo}
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

  it('should indent TODO comments to match the element they precede', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      [
        '<div>',
        '  <sky-grid settingsKey="grid1">',
        '    <sky-grid-column alignment="center"></sky-grid-column>',
        '  </sky-grid>',
        '</div>',
      ].join('\n'),
    );
    const result = await convert(tree);
    expect(result.readText('src/app/test.component.html')).toBe(
      [
        '<div>',
        `  ${settingsKeyTodo}`,
        '  <sky-data-grid>',
        `    ${otherAlignmentTodo}`,
        '    <sky-data-grid-column></sky-data-grid-column>',
        '  </sky-data-grid>',
        '</div>',
      ].join('\n'),
    );
  });

  it('should not indent a TODO comment for an element that shares a line with other content', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.html',
      '<div><sky-grid settingsKey="grid1"></sky-grid></div>',
    );
    const result = await convert(tree);
    expect(result.readText('src/app/test.component.html')).toBe(
      `<div>${settingsKeyTodo}\n<sky-data-grid></sky-data-grid></div>`,
    );
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
            ${dataTodo}
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
            ${listViewGridTodo}
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
      stripIndents`
        import { Component } from '@angular/core';
        ${listViewGridModuleMissingTodo}
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            ${listViewGridTodo}
            <sky-list-view-grid>
              <sky-grid-column field="name" heading="Name"></sky-grid-column>
            </sky-list-view-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    expect(hasLog('after migrating the <sky-list-view-grid>')).toBe(true);
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
            ${dataTodo}
            <sky-data-grid [data]="data">
              <sky-data-grid-column columnId="name" headingText="Name" field="name" />
            </sky-data-grid>
            ${listViewGridTodo}
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
            ${dataTodo}
            <sky-data-grid [data]="data">
              <sky-data-grid-column columnId="name" headingText="Name" field="name" />
            </sky-data-grid>
            ${listViewGridTodo}
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
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            ${listViewGridTodo}
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

  const convertedListViewGridHtml = stripIndents`
    ${listViewGridTodo}
    ${listViewGridHtml}
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
      convertedListViewGridHtml,
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
      convertedListViewGridHtml,
    );
    // logOnce dedupes messages across the whole suite, so the warning was
    // already logged by an earlier test; the TODO comment is added regardless.
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';
        ${listViewGridModuleMissingTodo}
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
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
      ${dataTodo}
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
      stripIndents`
        import { Component } from '@angular/core';
        ${importTodo('Replace SkyGridModule with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid after migrating the <sky-grid> that uses [columns].')}
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            ${columnsInputTodo}
            <sky-grid [data]="data" [columns]="cols"></sky-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    expect(hasLog('after migrating the <sky-grid> that uses [columns]')).toBe(
      true,
    );
  });

  it('should keep SkyGridModule alongside the data grid imports and warn when a converted grid and a columns-input grid share a file', async () => {
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
        ${importTodo('Remove SkyGridModule after migrating the <sky-grid> that uses [columns]: SkyDataGrid and SkyDataGridColumn were added alongside it.')}
        import { SkyGridModule } from '@skyux/grids';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: ${backtick}
            ${dataTodo}
            <sky-data-grid [data]="a">
              <sky-data-grid-column columnId="x" headingText="X" />
            </sky-data-grid>
            ${columnsInputTodo}
            <sky-grid [data]="b" [columns]="cols"></sky-grid>
          ${backtick},
          imports: [SkyGridModule, SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
    expect(
      hasLog('SkyDataGrid and SkyDataGridColumn were added alongside it'),
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
      convertedListViewGridHtml,
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

  it('should remove a redundant SkyGridModule import referenced in a TestBed configuration', async () => {
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
    tree.create(
      'src/app/foo.component.spec.ts',
      stripIndents`
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
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.component.spec.ts')}`)
      .toBe(stripIndents`
      import { TestBed } from '@angular/core/testing';
      import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

      import { FooComponent } from './foo.component';

      describe('FooComponent', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyListViewGridModule, FooComponent],
          });
        });
      });
    `);
  });

  it('should keep the import and warn when SkyGridModule is also referenced outside a decorator/TestBed imports array', async () => {
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

      const otherModules = [SkyGridModule];

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
    expect(stripIndents`${result.readText('src/app/foo.component.spec.ts')}`)
      .toBe(stripIndents`
      import { TestBed } from '@angular/core/testing';
      ${importTodo('Remove the remaining SkyGridModule references if nothing uses them: it was removed only where SkyListViewGridModule, which already exports it, is also imported.')}
      import { SkyGridModule } from '@skyux/grids';
      import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

      import { FooComponent } from './foo.component';

      const otherModules = [SkyGridModule];

      describe('FooComponent', () => {
        beforeEach(() => {
          TestBed.configureTestingModule({
            imports: [SkyListViewGridModule, FooComponent],
          });
        });
      });
    `);
    expect(hasLog('which already exports it, is also imported')).toBe(true);
  });

  it('should keep SkyGridModule in an NgModule export and warn when its imports is not an array literal', async () => {
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

        const SHARED_IMPORTS = [FooComponent];

        @NgModule({
          imports: SHARED_IMPORTS,
          exports: [SkyGridModule],
        })
        export class FooModule {}

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyGridModule],
        })
        export class BarModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';
        ${importTodo('Add SkyDataGrid and SkyDataGridColumn from @skyux/data-grid to the imports and exports of the NgModule that exports SkyGridModule, then remove SkyGridModule from it: its imports is not an array literal the migration can edit.')}
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        const SHARED_IMPORTS = [FooComponent];

        @NgModule({
          imports: SHARED_IMPORTS,
          exports: [SkyGridModule],
        })
        export class FooModule {}

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class BarModule {}
      `,
    );
    expect(hasLog('its imports is not an array literal')).toBe(true);
  });

  it('should keep SkyGridModule in an uneditable NgModule export alongside a columns-input grid', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/foo.component.html',
      stripIndents`
        <sky-grid [data]="a">
          <sky-grid-column id="x" heading="X" />
        </sky-grid>
        <sky-grid [data]="b" [columns]="cols"></sky-grid>
      `,
    );
    createExternalTemplateComponent(tree, 'foo', 'FooComponent');
    const input = stripIndents`
      import { NgModule } from '@angular/core';
      import { SkyGridModule } from '@skyux/grids';

      import { FooComponent } from './foo.component';

      const imports = [FooComponent];

      @NgModule({
        imports,
        exports: [SkyGridModule],
      })
      export class FooModule {}
    `;
    tree.create('src/app/foo.module.ts', input);
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      input.replace(
        'import { SkyGridModule }',
        `${importTodo('Remove SkyGridModule after migrating the <sky-grid> that uses [columns]: SkyDataGrid and SkyDataGridColumn were added alongside it.')}\n${importTodo('Add SkyDataGrid and SkyDataGridColumn from @skyux/data-grid to the imports and exports of the NgModule that exports SkyGridModule, then remove SkyGridModule from it: its imports is not an array literal the migration can edit.')}\nimport { SkyGridModule }`,
      ),
    );
  });

  it('should only remove SkyGridModule where SkyListViewGridModule is imported alongside it', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create('src/app/a.component.html', listViewGridHtml);
    createExternalTemplateComponent(tree, 'a', 'AComponent');
    tree.create(
      'src/app/foo.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { AComponent } from './a.component';

        @NgModule({
          declarations: [AComponent],
          imports: [SkyGridModule, SkyListViewGridModule],
        })
        export class FooModule {}

        @NgModule({
          imports: [SkyGridModule],
        })
        export class BarModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';
        ${importTodo('Remove the remaining SkyGridModule references if nothing uses them: it was removed only where SkyListViewGridModule, which already exports it, is also imported.')}
        import { SkyGridModule } from '@skyux/grids';
        import { SkyListViewGridModule } from '@skyux/list-builder-view-grids';

        import { AComponent } from './a.component';

        @NgModule({
          declarations: [AComponent],
          imports: [SkyListViewGridModule],
        })
        export class FooModule {}

        @NgModule({
          imports: [SkyGridModule],
        })
        export class BarModule {}
      `,
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
    expect(stripIndents`${result.readText('src/app/shared-grid.module.ts')}`)
      .toBe(stripIndents`
      import { NgModule } from '@angular/core';
      ${importTodo('Remove SkyGridModule if nothing uses it. Otherwise replace it with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid; an NgModule that re-exports it must list them in both imports and exports.')}
      import { SkyGridModule } from '@skyux/grids';

      @NgModule({
        exports: [SkyGridModule],
      })
      export class SharedGridModule {}
    `);
    expect(hasLog('Remove SkyGridModule if nothing uses it')).toBe(true);
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

  it('should not duplicate SkyDataGrid in an NgModule imports array that already imports it when only exports referenced SkyGridModule', async () => {
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
        import { SkyDataGrid } from '@skyux/data-grid';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid],
          exports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid, SkyDataGridColumn],
          exports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class FooModule {}
      `,
    );
  });

  it('should not edit the imports array when an NgModule already imports both SkyDataGrid and SkyDataGridColumn', async () => {
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
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
        import { SkyGridModule } from '@skyux/grids';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid, SkyDataGridColumn],
          exports: [SkyGridModule],
        })
        export class FooModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/foo.module.ts')}`).toBe(
      stripIndents`
        import { NgModule } from '@angular/core';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        import { FooComponent } from './foo.component';

        @NgModule({
          declarations: [FooComponent],
          imports: [SkyDataGrid, SkyDataGridColumn],
          exports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class FooModule {}
      `,
    );
  });

  it('should keep TODO comments on one line with escaped quotes in a quoted inline template', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/test.component.ts',
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyGridModule } from '@skyux/grids';

        @Component({
          selector: 'app-test',
          template: '<sky-grid settingsKey="grid1"></sky-grid>',
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const result = await convert(tree);
    const escapedSettingsKeyTodo = settingsKeyTodo.replaceAll("'", "\\'");
    expect(stripIndents`${result.readText('src/app/test.component.ts')}`).toBe(
      stripIndents`
        import { Component } from '@angular/core';
        import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

        @Component({
          selector: 'app-test',
          template: '${escapedSettingsKeyTodo} <sky-data-grid></sky-data-grid>',
          imports: [SkyDataGrid, SkyDataGridColumn],
        })
        export class TestComponent {}
      `,
    );
  });

  it('should not repeat TODO comments when run again on elements and imports it leaves unchanged', async () => {
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
            <sky-grid [data]="data" [columns]="cols"></sky-grid>
          ${backtick},
          imports: [SkyGridModule],
        })
        export class TestComponent {}
      `,
    );
    const firstRun = await convert(tree);
    const converted = firstRun.readText('src/app/test.component.ts');
    const secondRun = await convert(firstRun);
    expect(secondRun.readText('src/app/test.component.ts')).toBe(converted);
  });

  it('should add the import TODO above the declaration that imports SkyGridModule', async () => {
    const tree = await createTestApp(runner, { projectName: 'test-app' });
    tree.create(
      'src/app/shared-grid.module.ts',
      stripIndents`
        import { NgModule } from '@angular/core';
        import type { SkyGridSelectedRowsModelChange } from '@skyux/grids';
        import { SkyGridModule } from '@skyux/grids';

        @NgModule({
          exports: [SkyGridModule],
        })
        export class SharedGridModule {}
      `,
    );
    const result = await convert(tree);
    expect(stripIndents`${result.readText('src/app/shared-grid.module.ts')}`)
      .toBe(stripIndents`
      import { NgModule } from '@angular/core';
      import type { SkyGridSelectedRowsModelChange } from '@skyux/grids';
      ${importTodo('Remove SkyGridModule if nothing uses it. Otherwise replace it with SkyDataGrid and SkyDataGridColumn from @skyux/data-grid; an NgModule that re-exports it must list them in both imports and exports.')}
      import { SkyGridModule } from '@skyux/grids';

      @NgModule({
        exports: [SkyGridModule],
      })
      export class SharedGridModule {}
    `);
  });
});
