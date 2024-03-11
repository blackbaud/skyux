import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

describe('confirm-instance-observable.schematic', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    path.join(__dirname, '../../migration-collection.json'),
  );

  async function setup(): Promise<{
    runSchematic: () => Promise<UnitTestTree>;
    tree: UnitTestTree;
  }> {
    const tree = await createTestApp(runner, {
      projectName: 'foobar',
    });

    return {
      runSchematic: (): Promise<UnitTestTree> =>
        runner.runSchematic('confirm-instance-observable', {}, tree),
      tree,
    };
  }

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('Rename "SkyConfirmInstance.closed.next" calls to "SkyConfirmInstance.close"', async () => {
    const { runSchematic, tree } = await setup();

    tree.overwrite(
      '/src/app/app.component.spec.ts',
      stripIndents`
      confirmInstance.closed.next(confirmAction);
      skyConfirmInstance.closed.next({ action: 'ok' })
      skyConfirmInstance.closed.next({
        action: 'ok'
      })
      getConfirmInstance().closed.next()
      // Ignore modal instance:
      modalInstance.closed.next(
      `,
    );

    await runSchematic();

    expect(tree.readText('/src/app/app.component.spec.ts'))
      .toEqual(stripIndents`
      confirmInstance.close(confirmAction);
      skyConfirmInstance.close({ action: 'ok' })
      skyConfirmInstance.close({
        action: 'ok'
      })
      getConfirmInstance().close()
      // Ignore modal instance:
      modalInstance.closed.next(
      `);
  });

  it('Rename "SkyConfirmInstance.closed.next" calls to "SkyConfirmInstance.close"', async () => {
    const { runSchematic, tree } = await setup();

    tree.overwrite(
      '/src/app/app.component.spec.ts',
      stripIndents`
      confirmInstance.closed.emit(confirmAction);
      skyConfirmInstance.closed.emit({ action: 'ok' })
      skyConfirmInstance.closed.emit({
        action: 'ok'
      })
      getConfirmInstance().closed.emit()
      // Ignore modal instance:
      modalInstance.closed.emit(
      `,
    );

    await runSchematic();

    expect(tree.readText('/src/app/app.component.spec.ts'))
      .toEqual(stripIndents`
      confirmInstance.close(confirmAction);
      skyConfirmInstance.close({ action: 'ok' })
      skyConfirmInstance.close({
        action: 'ok'
      })
      getConfirmInstance().close()
      // Ignore modal instance:
      modalInstance.closed.emit(
      `);
  });
});
