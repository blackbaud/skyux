import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import { storiesGenerator } from './index';
import { StoriesGeneratorSchema } from './schema';

describe('stories generator', () => {
  let appTree: Tree;
  let options: StoriesGeneratorSchema;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
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
  });

  it('should throw an error when the project does not exist', async () => {
    try {
      await storiesGenerator(appTree, options);
      fail();
    } catch (e) {
      expect(e).toBeTruthy();
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
      expect(e).toBeTruthy();
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
      expect(e).toBeTruthy();
      expect((e as Error).message).toEqual(
        'Storybook is not configured for test-storybook'
      );
    }
  });
});
