import {
  applicationGenerator,
  libraryGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import { RoutingScope } from '@schematics/angular/module/schema';

import { angularModuleGenerator } from '../../utils';

import storyGenerator from './index';
import { ComponentGeneratorSchema } from './schema';

describe('component generator', () => {
  let appTree: Tree;
  let options: ComponentGeneratorSchema;

  beforeEach(async () => {
    appTree = createTreeWithEmptyV1Workspace();
    options = {
      name: 'example',
      project: 'test-storybook',
      generateCypressSpecs: true,
    };
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await applicationGenerator(appTree, {
      name: 'test-storybook',
    });
    await libraryGenerator(appTree, {
      name: 'storybook',
      directory: 'components',
    });
    await storybookConfigurationGenerator(appTree, {
      name: 'test-storybook',
      generateCypressSpecs: false,
      configureCypress: true,
      linter: Linter.None,
      generateStories: false,
    });
    await angularModuleGenerator(appTree, {
      name: 'test-router',
      routing: true,
      routingScope: RoutingScope.Root,
      flat: true,
      project: 'test-storybook',
    });
  });

  it('should run successfully', async () => {
    await storyGenerator(appTree, options);
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
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
        'apps/test-storybook/src/app/example/sub-example/sub-example.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should run successfully with --module', async () => {
    await storyGenerator(appTree, {
      ...options,
      module: 'test-router',
    });
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should run successfully, finding a module', async () => {
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
    await storyGenerator(appTree, options);
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.component.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.module.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    expect(
      appTree.read('apps/test-storybook/src/app/test-router.module.ts', 'utf-8')
    ).toMatchSnapshot();
  });

  it('should use -storybook project', async () => {
    await storyGenerator(appTree, {
      ...options,
      project: 'test',
    });
    expect(
      appTree.read(
        'apps/test-storybook/src/app/example/example.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    // expect(appTree.listChanges().filter(c => c.path.includes('test-storybook')).map(c => c.path)).toEqual([]);
    expect(
      appTree.isFile(
        'apps/test-storybook-e2e/src/integration/example.component.spec.ts'
      )
    ).toBeTruthy();
    expect(
      appTree.read(
        'apps/test-storybook-e2e/src/integration/example.component.spec.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should throw errors', async () => {
    appTree.write('apps/test-storybook/src/app/example/example.ts', 'test');
    try {
      await storyGenerator(appTree, options);
      fail();
    } catch (e) {
      expect(e.message).toEqual(`example already exists for test-storybook`);
    }
    appTree.delete('apps/test-storybook/src/app/example/example.ts');
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
    });
    try {
      await storyGenerator(appTree, {
        ...options,
        project: 'wrong',
      });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Unable to find project wrong-storybook'
      );
    }
    await applicationGenerator(appTree, {
      name: 'wrong-storybook',
    });
    try {
      await storyGenerator(appTree, {
        ...options,
        project: 'wrong',
      });
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Storybook is not configured for wrong-storybook'
      );
    }
    appTree.delete('apps/test-storybook/src/app/test-router-routing.module.ts');
    try {
      await storyGenerator(appTree, options);
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Could not find a router module to add the component to. Please specify a module using the --module option.'
      );
    }
  });
});
