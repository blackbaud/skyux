import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestApp } from '../../../../testing/scaffold';

import { eventTypeStrings } from './event-type-strings';

describe('event-type-strings', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../migration-collection.json'),
  );

  it('should do nothing if Events is not imported', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'migration-test',
    });
    const before = tree.readText('/src/app/app.component.ts');
    eventTypeStrings(tree, '/src/app/app.component.ts');
    expect(tree.readText('/src/app/app.component.ts')).toEqual(before);
  });

  it('should remove Events imports', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'migration-test',
    });
    tree.create(
      '/src/app/one.component.ts',
      `import { Events } from 'ag-grid-community';`,
    );
    tree.create(
      '/src/app/two.component.ts',
      `import { Events, GridOptions } from 'ag-grid-community';`,
    );

    eventTypeStrings(tree, '/src/app/one.component.ts');
    expect(tree.readText('/src/app/one.component.ts')).toEqual(``);

    eventTypeStrings(tree, '/src/app/two.component.ts');
    expect(tree.readText('/src/app/two.component.ts')).toEqual(
      `import {  GridOptions } from 'ag-grid-community';`,
    );
  });

  it('should replace Events with string', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'migration-test',
    });
    tree.create(
      '/src/app/test.component.ts',
      `
      import { Events, GridOptions } from 'ag-grid-community';
      fromEventPattern(
          (handler) =>
            params.column.addEventListener(
              Events.EVENT_FILTER_CHANGED,
              handler,
            ),
          (handler) =>
            params.column.removeEventListener(
              Events.EVENT_FILTER_CHANGED,
              handler,
            ),
        );
      `,
    );

    eventTypeStrings(tree, '/src/app/test.component.ts');
    expect(tree.readText('/src/app/test.component.ts')).toEqual(
      `
      import {  GridOptions } from 'ag-grid-community';
      fromEventPattern(
          (handler) =>
            params.column.addEventListener(
              'filterChanged',
              handler,
            ),
          (handler) =>
            params.column.removeEventListener(
              'filterChanged',
              handler,
            ),
        );
      `,
    );
  });

  it('should replace RowNode events with string', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'migration-test',
    });
    tree.create(
      '/src/app/test.component.ts',
      `
      import { RowNode, GridOptions } from 'ag-grid-community';
      fromEventPattern(
          (handler) =>
            params.column.addEventListener(
              RowNode.EVENT_ROW_SELECTED,
              handler,
            ),
          (handler) =>
            params.column.removeEventListener(
              RowNode.EVENT_ROW_SELECTED,
              handler,
            ),
        );
      `,
    );

    eventTypeStrings(tree, '/src/app/test.component.ts');
    expect(tree.readText('/src/app/test.component.ts')).toEqual(
      `
      import { RowNode, GridOptions } from 'ag-grid-community';
      fromEventPattern(
          (handler) =>
            params.column.addEventListener(
              'rowSelected',
              handler,
            ),
          (handler) =>
            params.column.removeEventListener(
              'rowSelected',
              handler,
            ),
        );
      `,
    );
  });

  it('should update rowDataChanged to rowDataUpdated', async () => {
    const tree = await createTestApp(runner, {
      projectName: 'migration-test',
    });
    tree.create(
      '/src/app/test.component.ts',
      `
      import { GridOptions } from 'ag-grid-community';
      params.api.addEventListener('rowDataChanged', handler);
      `,
    );

    eventTypeStrings(tree, '/src/app/test.component.ts');
    expect(tree.readText('/src/app/test.component.ts')).toEqual(
      `
      import { GridOptions } from 'ag-grid-community';
      params.api.addEventListener('rowDataUpdated', handler);
      `,
    );
  });
});
