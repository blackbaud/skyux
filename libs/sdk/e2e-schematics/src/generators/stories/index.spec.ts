import {
  applicationGenerator,
  componentGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import storiesGenerator from './index';
import { StoriesGeneratorSchema } from './schema';

describe('stories generator', () => {
  let appTree: Tree;
  let options: StoriesGeneratorSchema;

  beforeEach(() => {
    appTree = createTreeWithEmptyV1Workspace();
    options = {
      project: 'test',
      generateCypressSpecs: true,
    };
  });

  it('should run successfully', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await storybookConfigurationGenerator(appTree, {
      name: 'test',
      generateCypressSpecs: false,
      configureCypress: true,
      linter: Linter.None,
      generateStories: false,
    });
    await storiesGenerator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(
      appTree.read('apps/test/src/app/nx-welcome.component.stories.ts', 'utf-8')
    ).toMatchSnapshot();
  });

  it('should error if a project name is not given', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await storybookConfigurationGenerator(appTree, {
      name: 'test',
      generateCypressSpecs: false,
      configureCypress: true,
      linter: Linter.None,
      generateStories: false,
    });
    options.project = undefined;
    try {
      await storiesGenerator(appTree, options);
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown error');
      }
      expect(e.message).toBe('Project name not specified');
    }
  });

  it('should generate folder path', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await componentGenerator(appTree, {
      name: 'path/to/nested',
      project: 'test',
    });
    await storybookConfigurationGenerator(appTree, {
      name: 'test',
      generateCypressSpecs: false,
      configureCypress: true,
      linter: Linter.None,
      generateStories: false,
    });
    await storiesGenerator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
    expect(
      appTree.read(
        'apps/test/src/app/path/to/nested/nested.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/test-e2e/src/integration/path/to/nested/nested.component.spec.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should use -storybook project', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await applicationGenerator(appTree, {
      name: 'test-storybook',
    });
    await storybookConfigurationGenerator(appTree, {
      name: 'test-storybook',
      generateCypressSpecs: false,
      configureCypress: true,
      linter: Linter.None,
      generateStories: false,
    });
    await storiesGenerator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test-storybook');
    expect(config).toBeDefined();
    expect(
      appTree.read(
        'apps/test-storybook/src/app/nx-welcome.component.stories.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
    expect(
      appTree.read(
        'apps/test-storybook-e2e/src/integration/nx-welcome.component.spec.ts',
        'utf-8'
      )
    ).toMatchSnapshot();
  });

  it('should throw an error when the project does not exist', async () => {
    try {
      await storiesGenerator(appTree, options);
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual('Unable to find project test');
    }
  });

  it('should throw an error when the project does not have storybook', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    try {
      await storiesGenerator(appTree, options);
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Unable to find project test-storybook'
      );
    }
  });

  it('should throw an error when the project does not have storybook configured properly', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
    });
    await applicationGenerator(appTree, {
      name: 'test-storybook',
    });
    try {
      await storiesGenerator(appTree, options);
      fail();
    } catch (e) {
      expect((e as Error).message).toEqual(
        'Storybook is not configured for test-storybook'
      );
    }
  });
});
