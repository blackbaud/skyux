import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { createTestLibrary } from '../../testing/scaffold';
import { getWorkspace } from '../../utility/workspace';

describe('add-ag-grid-styles', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should add ag-grid styles to the project', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    const tree = await createTestLibrary(runner, { projectName: 'my-lib' });
    await runner.runSchematic('add-ag-grid-styles', { project: 'other' }, tree);
    expect(console.log).toHaveBeenCalledWith('Could not find project: other');

    await expect(
      runner.runSchematic('add-ag-grid-styles', { project: 'my-lib' }, tree),
    ).resolves.toBeTruthy();

    await expect(
      runner.runSchematic(
        'add-ag-grid-styles',
        { project: 'my-lib-showcase' },
        tree,
      ),
    ).resolves.toBeTruthy();

    const { workspace } = await getWorkspace(tree);
    const project = workspace.projects.get('my-lib-showcase');
    expect(project?.targets.get('build')?.options?.['styles']).toBeDefined();
    expect(project?.targets.get('build')?.options?.['styles']).toContain(
      '@skyux/ag-grid/css/sky-ag-grid.css',
    );
  });
});
