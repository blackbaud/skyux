import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp } from '../../../testing/scaffold';

describe('Migrations > Update rxjs-operators dependency', () => {
  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () => runner.runSchematic('rxjs-operators', {}, tree),
      tree,
    };
  }

  it('should replace rxjs/internal/operators with rxjs/operators', async () => {
    const { runSchematic, tree } = await setupTest();
    tree.create(
      'projects/my-app/src/app/rxjs.component.ts',
      `
        import { map } from 'rxjs/internal/operators/map';
        import { filter } from 'rxjs/internal/operators/filter';
        import { tap } from 'rxjs/internal/operators/tap';
        import { take } from 'rxjs/internal/operators/take';
      `
    );
    const result = await runSchematic();
    expect(result.readText('projects/my-app/src/app/rxjs.component.ts'))
      .toEqual(`
        import { map } from 'rxjs/operators';
        import { filter } from 'rxjs/operators';
        import { tap } from 'rxjs/operators';
        import { take } from 'rxjs/operators';
      `);
  });
});
