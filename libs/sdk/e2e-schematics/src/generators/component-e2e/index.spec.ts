import { libraryGenerator } from '@nrwl/angular/generators';
import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
import { ProjectConfiguration, readProjectConfiguration } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';

import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';

import componentE2eGenerator from './index';

describe('component-e2e', () => {
  it('should create e2e infrastructure for a component', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'test-component',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await componentE2eGenerator(tree, { name: 'test' });
    const config: { [_: string]: ProjectConfiguration } = {};
    for (const projectName of ['test-storybook', 'test-storybook-e2e']) {
      config[projectName] = readProjectConfiguration(tree, projectName);
      expect(config[projectName].projectType).toEqual('application');
    }
    expect(
      tree.exists(`${config['test-storybook'].root}/.storybook/main.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${config['test-storybook-e2e'].sourceRoot}/support/index.ts`)
    ).toBeTruthy();
    expect(
      tree
        .read(`${config['test-storybook-e2e'].sourceRoot}/support/index.ts`)
        .toString()
    ).toContain('percy');
  });

  it('should error without a name', async () => {
    const tree = createTreeWithEmptyWorkspace();
    try {
      await componentE2eGenerator(tree, { name: '' });
      fail();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should handle tagging', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'test-component',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await componentE2eGenerator(tree, { name: 'test', tags: 'one, two' });
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.tags).toContain('one');
  });

  it('should allow being called twice', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'test-component',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await componentE2eGenerator(tree, { name: 'test' });
    await componentE2eGenerator(tree, { name: 'test' });
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.projectType).toEqual('application');
  });
});
