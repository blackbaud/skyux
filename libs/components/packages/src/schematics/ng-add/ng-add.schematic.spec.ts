import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import { createTestLibrary } from '../testing/scaffold';

const COLLECTION_PATH = normalize(`${__dirname}/../../../collection.json`);

describe('ng-add.schematic', () => {
  const runner = new SchematicTestRunner('schematics', COLLECTION_PATH);
  runner.logger.subscribe((entry) => console.log(entry.message));
  const defaultProjectName = 'my-lib';

  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await createTestLibrary(runner, {
      projectName: defaultProjectName,
    });
  });

  function runSchematic(
    options: { project?: string } = {}
  ): Promise<UnitTestTree> {
    return runner.runSchematic('ng-add', options, tree);
  }

  function setTestOptionsMain() {
    const workspace: any = tree.readJson('angular.json');
    if (workspace.projects['my-lib'].architect.test.options) {
      workspace.projects['my-lib'].architect.test.options.main =
        'projects/my-lib/src/test.ts';
    }
    tree.overwrite('angular.json', JSON.stringify(workspace));
  }

  it('should apply a fix for crossvent "global is not defined" error', async () => {
    tree.create(
      'projects/my-lib/src/test.ts',
      `// This is a test file.\n// First, initialize the Angular testing environment.\n`
    );
    setTestOptionsMain();
    const updatedTree = await runSchematic();

    expect(
      updatedTree
        .readContent('projects/my-lib/src/test.ts')
        .match(/\(window as any\)\.global = window/)?.length
    ).toEqual(1);
  });

  it('should apply a fix for crossvent if project does not include test.ts', async () => {
    const updatedTree = await runSchematic();

    const files: string[] = [];
    updatedTree.visit((path) => files.push(path));
    // expect(files).toBe([]);
    const workspace: any = updatedTree.readJson('angular.json');
    expect(workspace.projects['my-lib'].architect.test.options.main).toBe(
      'projects/my-lib/src/test.ts'
    );
    expect(updatedTree.exists('projects/my-lib/src/test.ts')).toBeTruthy();
    expect(
      updatedTree
        .readContent('projects/my-lib/src/test.ts')
        .match(/\(window as any\)\.global = window/)?.length
    ).toEqual(1);
  });

  it('should not apply the crossvent fix if it already exists', async () => {
    tree.create(
      'projects/my-lib/src/test.ts',
      '(window as any).global = window;'
    );
    setTestOptionsMain();

    const updatedTree = await runSchematic();

    expect(
      updatedTree
        .readContent('projects/my-lib/src/test.ts')
        .match(/\(window as any\)\.global = window/)?.length
    ).toEqual(1);
  });

  it('should install @angular/cdk', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

    expect(packageJson.dependencies['@angular/cdk']).toBeDefined();
  });

  it('should install essential SKY UX packages', async () => {
    const updatedTree = await runSchematic();

    const packageJson = JSON.parse(updatedTree.readContent('package.json'));

    const packageNames = [
      '@skyux/assets',
      '@skyux/core',
      '@skyux/i18n',
      '@skyux/theme',
    ];

    for (const packageName of packageNames) {
      expect(packageJson.dependencies[packageName]).toEqual(
        '^0.0.0-PLACEHOLDER'
      );
    }
  });

  it('should add SKY UX theme stylesheets', async () => {
    const updatedTree = await runSchematic();

    const angularJson = JSON.parse(updatedTree.readContent('angular.json'));

    expect(
      angularJson.projects['my-lib-showcase'].architect.build.options.styles
    ).toEqual([
      'node_modules/@skyux/theme/css/sky.css',
      'node_modules/@skyux/theme/css/themes/modern/styles.css',
      'projects/my-lib-showcase/src/styles.css',
    ]);
  });
});
