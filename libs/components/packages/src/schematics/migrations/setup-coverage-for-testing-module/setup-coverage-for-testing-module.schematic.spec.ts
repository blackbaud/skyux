import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';
import { JsonFile } from '../../utility/json-file';

describe('Migrations > Setup specs for testing module', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'setup-coverage-for-testing-module';

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

  function createTestingModule(): void {
    tree.create(`projects/${defaultProjectName}/testing/ng-package.json`, `{}`);
    tree.create(`projects/${defaultProjectName}/testing/src/public-api.ts`, ``);
  }

  function runSchematic(name?: string): Promise<UnitTestTree> {
    return runner
      .runSchematicAsync(
        schematicName,
        {
          defaultProjectName: name || defaultProjectName,
        },
        tree
      )
      .toPromise();
  }

  function validateFiles() {
    const entryPointContents = tree.readContent(
      `projects/${defaultProjectName}/testing/src/test.ts`
    );
    expect(entryPointContents)
      .toEqual(`const context = (require as any).context('./', true, /.spec.ts$/);
context.keys().map(context);
`);

    const specTsConfig = new JsonFile(
      tree,
      `projects/${defaultProjectName}/tsconfig.spec.json`
    );
    expect(specTsConfig.get(['files'])).toEqual([
      'src/test.ts',
      'testing/src/test.ts',
    ]);

    const libTsConfig = new JsonFile(
      tree,
      `projects/${defaultProjectName}/tsconfig.lib.json`
    );
    expect(libTsConfig.get(['exclude'])).toEqual([
      'src/test.ts',
      '**/*.spec.ts',
      'testing/src/test.ts',
    ]);
  }

  it('should setup testing module for code coverage', async () => {
    createTestingModule();
    await runSchematic();
    validateFiles();
  });

  it('should abort if testing module not found', async () => {
    const updatedTree = await runSchematic();
    expect(
      updatedTree.exists(`projects/${defaultProjectName}/testing/src/test.ts`)
    ).toEqual(false);
  });

  it('should abort if project type is application', async () => {
    tree = await createTestApp(runner, {
      defaultProjectName: 'my-app',
    });

    const updatedTree = await runSchematic('my-app');

    expect(updatedTree.exists('projects/my-app/testing/src/test.ts')).toEqual(
      false
    );
  });

  it('should abort if testing module already setup', async () => {
    createTestingModule();
    await runSchematic();
    validateFiles();
    // Run the schematic again.
    await runSchematic();
    validateFiles();
  });
});
