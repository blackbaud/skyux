import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { readProjectConfiguration } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { removeGenerator } from '@nrwl/workspace';

import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';

import configureStorybook from './index';

describe('configure-storybook', () => {
  it('should configure storybook', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, { name: `test-app` });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    await configureStorybook(tree, { name: 'test-app' });
    expect(tree.exists(`apps/test-app/.storybook/preview.js`)).toBeFalsy();
    expect(tree.exists(`apps/test-app/.storybook/preview.ts`)).toBeTruthy();
    const e2eConfig = readProjectConfiguration(tree, `test-app-e2e`);
    expect(e2eConfig.targets.e2e.options.devServerTarget).toEqual(
      `test-app:storybook`
    );
    expect(e2eConfig.targets.e2e.configurations.ci.skipServe).toBeTruthy();
  });

  it('should configure storybook tsconfig', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, { name: `test-app` });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    tree.delete(`apps/test-app/.storybook/tsconfig.json`);
    await configureStorybook(tree, { name: 'test-app' });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
  });

  it('should skip configuration for non-cypress e2e project', async () => {
    const tree = createTreeWithEmptyWorkspace(1);
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, { name: `test-app` });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    await removeGenerator(tree, {
      projectName: `test-app-e2e`,
      forceRemove: true,
      skipFormat: true,
    });
    await applicationGenerator(tree, { name: `test-app-e2e` });
    await configureStorybook(tree, { name: 'test-app' });
    const e2eConfig = readProjectConfiguration(tree, `test-app-e2e`);
    expect(e2eConfig.targets.e2e).toBeFalsy();
  });
});
