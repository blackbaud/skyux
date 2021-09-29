import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { SkyuxVersions } from '../shared/skyux-versions';
import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = path.resolve(__dirname, '../collection.json');

describe('ng-add.schematic', () => {
  const defaultProjectName = 'my-app';

  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(async () => {
    runner = new SchematicTestRunner('schematics', COLLECTION_PATH);

    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function runSchematic(
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematicAsync('ng-add', options, tree).toPromise();
  }

  function readPackageJson(tree: UnitTestTree): any {
    return JSON.parse(tree.readContent('package.json'));
  }

  it('should run the NodePackageInstallTask', async () => {
    await runSchematic();

    expect(runner.tasks.some((task) => task.name === 'node-package')).toEqual(
      true
    );
  });

  it('should add dependencies', async () => {
    const updatedTree = await runSchematic();
    const packageJson = readPackageJson(updatedTree);
    expect(packageJson.dependencies).toEqual(
      jasmine.objectContaining({
        '@skyux/assets': SkyuxVersions.Assets,
      })
    );
  });

  it('should add package.json script', async () => {
    const updatedTree = await runSchematic();
    const packageJson = readPackageJson(updatedTree);
    expect(packageJson.scripts['skyux:generate-lib-resources-module']).toEqual(
      'ng generate @skyux/i18n:lib-resources-module'
    );
  });

  it('should handle an empty scripts section', async () => {
    // Delete the scripts section, first.
    let packageJson = readPackageJson(tree);
    delete packageJson.scripts;
    tree.overwrite('package.json', JSON.stringify(packageJson));

    const updatedTree = await runSchematic();

    packageJson = readPackageJson(updatedTree);

    expect(packageJson.scripts['skyux:generate-lib-resources-module']).toEqual(
      'ng generate @skyux/i18n:lib-resources-module'
    );
  });
});
