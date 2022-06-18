import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import {
  E2eTestRunner,
  UnitTestRunner,
} from '@nrwl/angular/src/utils/test-runners';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import { StoriesGeneratorSchema } from './schema';
import { storiesGenerator } from './index';

describe('stories generator', () => {
  let appTree: Tree;
  const options: StoriesGeneratorSchema = {
    project: 'test',
    generateCypressSpecs: true,
  };

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await applicationGenerator(appTree, {
      name: 'test',
      unitTestRunner: UnitTestRunner.None,
      e2eTestRunner: E2eTestRunner.Cypress,
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

  it('should throw an error', async () => {
    try {
      await storiesGenerator(appTree, options);
      fail();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
