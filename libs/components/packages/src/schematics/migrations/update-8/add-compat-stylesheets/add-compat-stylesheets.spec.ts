import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

import { join } from 'path';

import { createTestApp, createTestLibrary } from '../../../testing/scaffold';

describe('Migrations > Add compat stylesheets', () => {
  const compatStylesheetPath = 'src/app/skyux8-compat.css';

  const textExpandRepeaterContents = `/*******************************************************************************
 * TODO: The following component libraries introduced visual breaking changes
 * in SKY UX 8. Each block of CSS reintroduces the styles that were changed or
 * removed for backwards compatibility. You will need to do the following
 * before migrating to the next major version of SKY UX:
 * - Address each of the changes by following the instructions
 *   in each block of CSS, then remove the block.
 * - Delete this file after all blocks have been addressed.
 * - Remove each occurrence of this file in your project's
 *   angular.json file.
 *******************************************************************************/

/*******************************************************************************
 * COMPONENT: TEXT EXPAND REPEATER
 *******************************************************************************/

/*******************************************************************************
 * The top margin has been removed from the \`sky-text-expand-repeater\`
 * component. To address this, remove this block of CSS and address any
 * spacing issues by adding the appropriate margin class to the element above
 * each text expand repeater or padding class to each text expand repeater's
 * parent element. See
 * https://developer.blackbaud.com/skyux/design/styles/spacing for a list of
 * supported spacing classes.
 *******************************************************************************/

:root {
  --sky-compat-text-expand-repeater-margin-top: unset;
}
`;

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
    expectedContents: string,
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

    const compatStyles = updatedTree.exists(compatStylesheetPath)
      ? updatedTree.readText(compatStylesheetPath)
      : '';

    expect(compatStyles).toBe(expectedContents);

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
          '@skyux/layout': '7.0.0',
        },
      }),
      textExpandRepeaterContents,
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
      textExpandRepeaterContents,
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
      textExpandRepeaterContents,
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
      textExpandRepeaterContents,
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
