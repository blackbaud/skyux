import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { getWorkspacePath, readProjectConfiguration } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';
import { removeGenerator } from '@nrwl/workspace';

import { updateJson } from '../../utils';

import configureStorybook from './index';

describe('configure-storybook', () => {
  it('should configure storybook', async () => {
    const tree = createTreeWithEmptyV1Workspace();
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
    updateJson(tree, getWorkspacePath(tree), (json) => {
      delete json['projects']['test-app'].architect.build.options;
      return json;
    });
    await configureStorybook(tree, { name: 'test-app' });
    expect(
      readProjectConfiguration(tree, `test-app`).targets.build.options.styles
        .length
    ).toBeGreaterThan(0);
    updateJson(tree, getWorkspacePath(tree), (json) => {
      json['projects']['test-app'].architect.build.options = {};
      return json;
    });
    await configureStorybook(tree, { name: 'test-app' });
    expect(
      readProjectConfiguration(tree, `test-app`).targets.build.options.styles
        .length
    ).toBeGreaterThan(0);
  });

  it('should configure storybook tsconfig', async () => {
    const tree = createTreeWithEmptyV1Workspace();
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

  it('should configure storybook tsconfig, add include', async () => {
    const tree = createTreeWithEmptyV1Workspace();
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, { name: `test-app` });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    updateJson<TsConfig>(
      tree,
      `apps/test-app/.storybook/tsconfig.json`,
      (tsconfig) => {
        delete tsconfig.include;
        return tsconfig;
      }
    );
    await configureStorybook(tree, { name: 'test-app' });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
    expect(
      JSON.parse(tree.read(`apps/test-app/.storybook/tsconfig.json`).toString())
        .include
    ).toBeTruthy();
  });

  it('should skip configuration for non-cypress e2e project', async () => {
    const tree = createTreeWithEmptyV1Workspace();
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
    const errorSpy = jest.spyOn(console, 'error');
    await configureStorybook(tree, { name: 'test-app' });
    await configureStorybook(tree, { name: 'test-app', ansiColor: false });
    const e2eConfig = readProjectConfiguration(tree, `test-app-e2e`);
    expect(e2eConfig.targets.e2e).toBeFalsy();
    expect(errorSpy).toHaveBeenCalledWith(
      `Project "test-app-e2e" does not have an e2e target with @nrwl/cypress:cypress`
    );
  });
});
