import { libraryGenerator } from '@nx/angular/generators';
import {
  NxJsonConfiguration,
  Tree,
  getProjects,
  readNxJson,
  updateNxJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { RoutingScope } from '@schematics/angular/module/schema';

import assert from 'node:assert';
import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

import { angularModuleGenerator } from '../../utils/angular-module-generator';
import { createTestApplication, createTestLibrary } from '../../utils/testing';
import componentE2e from '../component-e2e';

import storyGenerator from './index';
import { ComponentGeneratorSchema } from './schema';

describe('story generator', () => {
  let appTree: Tree;
  let options: ComponentGeneratorSchema;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    appTree.write('.gitignore', '');
    const nxJson: NxJsonConfiguration = readNxJson(appTree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(appTree, nxJson);
    options = {
      name: 'example',
      project: 'test-storybook',
      generateCypressSpecs: true,
      includeTests: true,
    };
    await createTestLibrary(appTree, { name: 'test' });
    await componentE2e(appTree, { name: 'test' });
    await angularModuleGenerator(appTree, {
      name: 'test-router',
      routing: true,
      routingScope: RoutingScope.Root,
      flat: true,
      project: 'test-storybook',
    });
  });

  it('should run successfully', async () => {
    const projects = getProjects(appTree);
    ['test-storybook', 'test-storybook-e2e'].forEach((projectName) => {
      const projectConfig = projects.get(projectName);
      expect(projectConfig).toBeDefined();
      assert.ok(projectConfig);
      delete projectConfig.sourceRoot;
      updateProjectConfiguration(appTree, projectName, projectConfig);
    });
    await storyGenerator(appTree, options);
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
  });

  it('should error if a project name is not given', async () => {
    options.project = undefined;
    try {
      await storyGenerator(appTree, options);
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown error');
      }
      expect(e.message).toBe('Project name not specified');
    }
  });

  it('should run successfully with sub directory', async () => {
    await angularModuleGenerator(appTree, {
      name: 'test-sub',
      project: 'test-storybook',
      routing: true,
      routingScope: RoutingScope.Child,
      route: 'sub2',
      module: 'test-router',
    });
    await storyGenerator(appTree, {
      ...options,
      name: 'example/sub-example',
    });
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/sub-example/sub-example.component.stories.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
  });

  it('should run successfully, when not including tests', async () => {
    await angularModuleGenerator(appTree, {
      name: 'sub-test',
      project: 'test-storybook',
      flat: true,
      routing: true,
      routingScope: RoutingScope.Child,
      route: 'sub1',
      module: 'test-router',
    });
    await angularModuleGenerator(appTree, {
      name: 'test-sub',
      project: 'test-storybook',
      routing: true,
      routingScope: RoutingScope.Child,
      route: 'sub2',
      module: 'test-router',
    });
    await angularModuleGenerator(appTree, {
      name: 'test-sub/test-sub-sub',
      project: 'test-storybook',
      routing: true,
      routingScope: RoutingScope.Child,
      route: 'sub3',
      module: 'test-sub',
    });
    await storyGenerator(appTree, {
      ...options,
      name: 'example/sub-example',
      includeTests: false,
    });
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/sub-example/sub-example.component.stories.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/sub-example/sub-example.component.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/sub-example/sub-example.component.spec.ts',
        'utf-8',
      ),
    ).toBeNull();
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/test-router.module.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
  });

  it('should use -storybook project', async () => {
    await storyGenerator(appTree, {
      ...options,
      project: 'test',
    });
    expect(
      appTree.read(
        'apps/e2e/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
    // expect(appTree.listChanges().filter(c => c.path.includes('test-storybook')).map(c => c.path)).toEqual([]);
    expect(
      appTree.isFile(
        'apps/e2e/test-storybook-e2e/src/e2e/example/example.component.cy.ts',
      ),
    ).toBeTruthy();
    expect(
      appTree.read(
        'apps/e2e/test-storybook-e2e/src/e2e/example/example.component.cy.ts',
        'utf-8',
      ),
    ).toMatchSnapshot();
  });

  it('should throw errors', async () => {
    appTree.write(
      'apps/e2e/test-storybook/src/app/example/example.component.ts',
      'test',
    );

    try {
      await storyGenerator(appTree, options);
      fail('should have thrown');
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown an error');
      }
      expect(e.message).toBe(`example already exists for test-storybook`);
    }

    appTree.delete(
      'apps/e2e/test-storybook/src/app/example/example.component.ts',
    );
    try {
      await storyGenerator(appTree, {
        ...options,
        project: 'wrong',
      });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual('Unable to find project wrong');
    }
    await libraryGenerator(appTree, {
      name: 'wrong',
      directory: 'wrong',
      skipFormat: true,
      skipPackageJson: true,
    });
    try {
      await storyGenerator(appTree, {
        ...options,
        project: 'wrong',
      });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Unable to find project wrong-storybook',
      );
    }
    await createTestApplication(appTree, { name: 'wrong-storybook' });
    try {
      await storyGenerator(appTree, {
        ...options,
        project: 'wrong',
      });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Storybook is not configured for wrong-storybook',
      );
    }
  });
});
