import {
  UnitTestRunner,
  applicationGenerator,
  libraryGenerator,
} from '@nrwl/angular/generators';
import { ProjectConfiguration, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import componentE2eGenerator from './index';

describe('component-e2e', () => {
  it('should create e2e infrastructure for a component', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
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
      tree.read(
        `${config['test-storybook'].sourceRoot}/app/app.module.ts`,
        'utf8'
      )
    ).toMatchSnapshot();
    expect(
      tree.isFile(
        `${config['test-storybook'].sourceRoot}/app/app.component.spec.ts`
      )
    ).toBeFalsy();
    expect(
      tree.isFile(
        `${config['test-storybook'].sourceRoot}/app/nx-welcome.component.ts`
      )
    ).toBeFalsy();
    expect(
      tree.exists(`${config['test-storybook-e2e'].sourceRoot}/support/index.ts`)
    ).toBeTruthy();
    expect(
      tree
        .read(`${config['test-storybook-e2e'].sourceRoot}/support/index.ts`)
        ?.toString()
    ).toContain('percy');
  });

  it('should error without a name', async () => {
    const tree = createTreeWithEmptyWorkspace();
    try {
      await componentE2eGenerator(tree, { name: '' });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Please provide the component library name'
      );
    }
  });

  it('should handle tagging', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
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
    const spy = jest.spyOn(console, 'warn');
    const tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await libraryGenerator(tree, {
      name: 'test-component',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await componentE2eGenerator(tree, { name: 'test' });
    await componentE2eGenerator(tree, { name: 'test' });
    await componentE2eGenerator(tree, { name: 'test', ansiColor: false });
    expect(spy).toHaveBeenCalledWith(
      `The project "test-storybook" already exists.`
    );
    const config = readProjectConfiguration(tree, 'test-storybook');
    expect(config.projectType).toEqual('application');
  });

  it('should move the projects to a subdirectory', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await libraryGenerator(tree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await libraryGenerator(tree, {
      name: 'test-component',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await applicationGenerator(tree, {
      name: 'test-component-storybook',
    });
    await componentE2eGenerator(tree, { name: 'test-component' });
    const config = readProjectConfiguration(tree, 'test-component-storybook');
    expect(config.root).toEqual('apps/e2e/test-component-storybook');
  });
});
