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
    const recorder = {
      remove: jest.fn(),
      insertRight: jest.fn(),
    };
    eventTypeStrings(tree, '/src/app/app.component.ts', recorder);
    expect(recorder.remove).not.toHaveBeenCalled();
    expect(recorder.insertRight).not.toHaveBeenCalled();
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

    const recorderOne = {
      remove: jest.fn(),
      insertRight: jest.fn(),
    };
    eventTypeStrings(tree, '/src/app/one.component.ts', recorderOne);
    expect(recorderOne.remove).toHaveBeenCalledWith(9, 6);
    expect(recorderOne.insertRight).not.toHaveBeenCalled();

    const recorderTwo = {
      remove: jest.fn(),
      insertRight: jest.fn(),
    };
    eventTypeStrings(tree, '/src/app/two.component.ts', recorderTwo);
    expect(recorderTwo.remove).toHaveBeenCalledWith(9, 6);
    expect(recorderTwo.remove).toHaveBeenCalledWith(15, 1);
    expect(recorderTwo.insertRight).not.toHaveBeenCalled();
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

    const recorder = {
      remove: jest.fn(),
      insertRight: jest.fn(),
    };
    eventTypeStrings(tree, '/src/app/test.component.ts', recorder);
    expect(recorder.remove).toHaveBeenCalledWith(169, 27);
    expect(recorder.insertRight).toHaveBeenCalledWith(169, `'filterChanged'`);
    expect(recorder.remove).toHaveBeenCalledWith(320, 27);
    expect(recorder.insertRight).toHaveBeenCalledWith(320, `'filterChanged'`);
  });
});
