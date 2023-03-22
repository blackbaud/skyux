import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';

describe('Migrations > Add compat stylesheets', () => {
  const compatStylesheetPath = 'src/app/skyux8-compat.css';

  const runner = new SchematicTestRunner(
    'migrations',
    join(__dirname, '../../migration-collection.json')
  );

  async function setupTest() {
    const tree = await createTestApp(runner, {
      projectName: 'my-app',
    });

    return {
      runSchematic: () =>
        runner
          .runSchematicAsync('add-compat-stylesheets', {}, tree)
          .toPromise(),
      tree,
    };
  }

  async function validateCompatStylesheet(
    packageJson: string,
    existingWorkspaceStylesheets: string[] | undefined,
    existingCompatStylesheet?: string
  ): Promise<void> {
    const projectTargets = ['build', 'test'];

    const { runSchematic, tree } = await setupTest();

    tree.overwrite('/package.json', packageJson);

    if (existingCompatStylesheet) {
      tree.create(compatStylesheetPath, existingCompatStylesheet);
    }

    let angularJson = JSON.parse(tree.readContent('/angular.json'));

    for (const target of projectTargets) {
      angularJson.projects['my-app'].architect[target].options.styles =
        existingWorkspaceStylesheets;
    }

    tree.overwrite('/angular.json', JSON.stringify(angularJson));

    const updatedTree = await runSchematic();

    expect(updatedTree.readText(compatStylesheetPath)).toMatchSnapshot();

    angularJson = updatedTree.readJson('/angular.json');

    const expectedStyles = [
      ...(existingWorkspaceStylesheets || []),
      compatStylesheetPath,
    ];

    for (const target of projectTargets) {
      expect(
        angularJson.projects['my-app'].architect[target].options.styles
      ).toEqual(expectedStyles);
    }
  }

  it('should not add a compat stylesheet if a corresponding library is not installed', async () => {
    const { runSchematic, tree } = await setupTest();

    const originalAngularJson = tree.readContent('angular.json');
    await runSchematic();
    const newAngularJson = tree.readContent('angular.json');

    expect(tree.exists(compatStylesheetPath)).toBe(false);

    // Workspace config should remain untouched.
    expect(originalAngularJson).toEqual(newAngularJson);
  });

  it('should add a compat stylesheet for libraries in dependencies', async () => {
    await validateCompatStylesheet(
      JSON.stringify({
        dependencies: {
          '@skyux/forms': '7.0.0',
          '@skyux/layout': '7.0.0',
        },
      }),
      []
    );
  });

  it('should add a compat stylesheet for libraries in devDependencies', async () => {
    await validateCompatStylesheet(
      JSON.stringify({
        devDependencies: {
          '@skyux/layout': '7.0.0',
        },
      }),
      []
    );
  });

  it('should overwrite an existing compat stylesheet', async () => {
    await validateCompatStylesheet(
      JSON.stringify({
        devDependencies: {
          '@skyux/layout': '7.0.0',
        },
      }),
      [],
      '/* */'
    );
  });

  it('should handle missing styles array', async () => {
    await validateCompatStylesheet(
      JSON.stringify({
        devDependencies: {
          '@skyux/layout': '7.0.0',
        },
      }),
      undefined, // <-- empty array
      '/* */'
    );
  });

  it('should ignore build target for libraries', async () => {
    const tree = await createTestLibrary(runner, {
      projectName: 'my-lib',
    });

    runner.runSchematicAsync('add-compat-stylesheets', {}, tree).toPromise();

    tree.overwrite(
      '/package.json',
      JSON.stringify({
        dependencies: {
          '@skyux/layout': '7.0.0',
        },
      })
    );

    let angularJson = JSON.parse(tree.readContent('/angular.json'));

    const updatedTree = await runner
      .runSchematicAsync('add-compat-stylesheets', {}, tree)
      .toPromise();

    const libShowcaseCompatStylesheetPath =
      'projects/my-lib-showcase/src/app/skyux8-compat.css';

    angularJson = JSON.parse(updatedTree.readContent('/angular.json'));

    expect(
      angularJson.projects['my-lib'].architect.build.options.styles
    ).toBeUndefined();

    expect(
      angularJson.projects['my-lib'].architect.test.options.styles
    ).toBeUndefined();

    expect(updatedTree.exists(libShowcaseCompatStylesheetPath)).toEqual(true);

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles
    ).toContain(libShowcaseCompatStylesheetPath);

    expect(
      angularJson.projects['my-lib-showcase'].architect.test.options.styles
    ).toContain(libShowcaseCompatStylesheetPath);
  });
});
