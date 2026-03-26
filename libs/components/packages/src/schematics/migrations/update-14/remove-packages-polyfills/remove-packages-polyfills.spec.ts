import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

import path from 'node:path';

import { createTestApp } from '../../../testing/scaffold';

const COLLECTION_PATH = path.join(__dirname, '../../../../../migrations.json');

const SCHEMATIC_NAME = 'remove-packages-polyfills';

async function setup(): Promise<{
  runSchematic: () => Promise<UnitTestTree>;
  tree: UnitTestTree;
}> {
  const runner = new SchematicTestRunner('migrations', COLLECTION_PATH);

  const tree = await createTestApp(runner, {
    projectName: 'my-app',
  });

  return {
    runSchematic: () => runner.runSchematic(SCHEMATIC_NAME, {}, tree),
    tree,
  };
}

function getAngularJson(tree: UnitTestTree): Record<string, unknown> {
  return JSON.parse(tree.readText('/angular.json'));
}

function getPolyfills(
  angularJson: Record<string, unknown>,
  projectName: string,
  targetName: string,
): string[] | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (angularJson as any).projects?.[projectName]?.architect?.[targetName]
    ?.options?.polyfills;
}

function addPolyfill(
  tree: UnitTestTree,
  projectName: string,
  targetName: string,
): void {
  const angularJson = getAngularJson(tree);
  const polyfills = getPolyfills(angularJson, projectName, targetName);

  if (polyfills) {
    polyfills.push('@skyux/packages/polyfills');
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));
  }
}

describe('remove-packages-polyfills', () => {
  it('should remove @skyux/packages/polyfills from build polyfills', async () => {
    const { runSchematic, tree } = await setup();

    addPolyfill(tree, 'my-app', 'build');

    const polyfillsBefore = getPolyfills(
      getAngularJson(tree),
      'my-app',
      'build',
    );

    expect(polyfillsBefore).toContain('@skyux/packages/polyfills');

    const updatedTree = await runSchematic();

    const polyfillsAfter = getPolyfills(
      getAngularJson(updatedTree),
      'my-app',
      'build',
    );

    expect(polyfillsAfter).not.toContain('@skyux/packages/polyfills');
  });

  it('should remove @skyux/packages/polyfills from test polyfills', async () => {
    const { runSchematic, tree } = await setup();

    addPolyfill(tree, 'my-app', 'test');

    const polyfillsBefore = getPolyfills(
      getAngularJson(tree),
      'my-app',
      'test',
    );

    expect(polyfillsBefore).toContain('@skyux/packages/polyfills');

    const updatedTree = await runSchematic();

    const polyfillsAfter = getPolyfills(
      getAngularJson(updatedTree),
      'my-app',
      'test',
    );

    expect(polyfillsAfter).not.toContain('@skyux/packages/polyfills');
  });

  it('should preserve other polyfills', async () => {
    const { runSchematic, tree } = await setup();

    addPolyfill(tree, 'my-app', 'test');

    const updatedTree = await runSchematic();

    const polyfillsAfter = getPolyfills(
      getAngularJson(updatedTree),
      'my-app',
      'test',
    );

    expect(polyfillsAfter).toContain('zone.js');
    expect(polyfillsAfter).toContain('zone.js/testing');
  });

  it('should succeed if polyfills does not include @skyux/packages/polyfills', async () => {
    const { runSchematic } = await setup();

    await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
  });

  it('should succeed if target has no polyfills option', async () => {
    const { runSchematic, tree } = await setup();

    const angularJson = getAngularJson(tree);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (angularJson as any).projects['my-app'].architect.test.options
      .polyfills;
    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await expect(runSchematic()).resolves.toBeInstanceOf(UnitTestTree);
  });
});
