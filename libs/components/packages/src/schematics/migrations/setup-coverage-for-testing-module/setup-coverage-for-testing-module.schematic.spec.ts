import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'path';

import { createTestApp, createTestLibrary } from '../../testing/scaffold';

describe('Migrations > Setup specs for testing module', () => {
  const collectionPath = path.join(__dirname, '../migration-collection.json');
  const defaultProjectName = 'my-lib';
  const schematicName = 'setup-coverage-for-testing-module';

  const testingModuleContext = `// Find any tests included in the "testing" entry point.
try {
  const testingContext = require.context('../testing/', true, /\\.spec\\.ts$/);
  testingContext.keys().map(testingContext);
} catch (err) {}`;

  const runner = new SchematicTestRunner('migrations', collectionPath);

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      name: defaultProjectName,
    });
  });

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

  function validateFiles(updatedTree: UnitTestTree) {
    const entryPointContents = updatedTree.readContent(
      `projects/${defaultProjectName}/src/test.ts`
    );
    expect(entryPointContents)
      .toEqual(`// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true }},
);

// Then we find all the tests.
const context = require.context('./', true, /\\.spec\\.ts$/);
// And load the modules.
context.keys().map(context);

${testingModuleContext}
`);

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));
    expect(
      angularJson.projects[defaultProjectName].architect.test.options
        .codeCoverageExclude
    ).toEqual([`projects/${defaultProjectName}/src/test.ts`]);
  }

  it('should setup testing module for code coverage', async () => {
    const updatedTree = await runSchematic();
    validateFiles(updatedTree);
  });

  it('should abort if testing module already setup', async () => {
    let updatedTree = await runSchematic();
    validateFiles(updatedTree);
    // Run the schematic again.
    updatedTree = await runSchematic();
    validateFiles(updatedTree);
  });

  it('should abort if project type is application', async () => {
    tree = await createTestApp(runner, {
      defaultProjectName: 'my-app',
    });

    const updatedTree = await runSchematic('my-app');

    const contents = updatedTree.readContent('/src/test.ts');
    expect(contents).not.toContain(testingModuleContext);
  });
});
