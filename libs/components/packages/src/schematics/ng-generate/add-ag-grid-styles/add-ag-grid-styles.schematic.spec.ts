import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { createTestLibrary } from '../../testing/scaffold';

describe('add-ag-grid-styles', () => {
  const runner = new SchematicTestRunner(
    'schematics',
    require.resolve('../../../../collection.json'),
  );

  it('should add ag-grid styles to the project', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
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

    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get('my-lib-showcase');
    expect(project?.targets.get('build')?.options?.['styles']).toBeDefined();
    expect(project?.targets.get('build')?.options?.['styles']).toContain(
      '@skyux/ag-grid/css/sky-ag-grid.css',
    );
  });

  it('should add ag-grid styles for projects using the SKY UX build builder', async () => {
    const tree = await createTestLibrary(runner, { projectName: 'my-lib' });

    const angularJson = tree.readJson('/angular.json') as {
      projects: Record<
        string,
        { architect: Record<string, { builder: string }> }
      >;
    };

    angularJson.projects['my-lib-showcase'].architect['build'].builder =
      '@blackbaud-internal/skyux-build:application';

    tree.overwrite('/angular.json', JSON.stringify(angularJson));

    await runner.runSchematic(
      'add-ag-grid-styles',
      { project: 'my-lib-showcase' },
      tree,
    );

    const workspace = await getWorkspace(tree);
    const project = workspace.projects.get('my-lib-showcase');

    expect(project?.targets.get('build')?.options?.['styles']).toContain(
      '@skyux/ag-grid/css/sky-ag-grid.css',
    );
  });
});
