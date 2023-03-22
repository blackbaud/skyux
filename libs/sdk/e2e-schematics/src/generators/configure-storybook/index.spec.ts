import {
  E2eTestRunner,
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import {
  NxJsonConfiguration,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';
import { TsConfig } from '@nrwl/storybook/src/utils/utilities';

import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

import { updateJson } from '../../utils';

import configureStorybook from './index';

describe('configure-storybook', () => {
  function setupTest() {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    const nxJson: NxJsonConfiguration = readNxJson(tree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(tree, nxJson);

    tree.write('.gitignore', '');

    return { tree };
  }

  it('should configure storybook', async () => {
    const { tree } = setupTest();
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
    expect(tree.read(`apps/test-app/.storybook/preview.ts`, 'utf-8')).toContain(
      `import { moduleMetadata } from '@storybook/angular';`
    );
    const e2eConfig = readProjectConfiguration(tree, `test-app-e2e`);
    expect(e2eConfig.targets?.e2e.options.devServerTarget).toEqual(
      `test-app:storybook`
    );
    let testAppConfig = readProjectConfiguration(tree, `test-app`);
    delete testAppConfig.targets?.build.options;
    updateProjectConfiguration(tree, `test-app`, testAppConfig);
    let testE2eAppConfig = readProjectConfiguration(tree, `test-app-e2e`);
    delete testE2eAppConfig.targets?.e2e.configurations;
    updateProjectConfiguration(tree, `test-app-e2e`, testE2eAppConfig);
    await configureStorybook(tree, { name: 'test-app' });
    expect(
      readProjectConfiguration(tree, `test-app`).targets?.build.options.styles
        .length
    ).toBeGreaterThan(0);
    testAppConfig = readProjectConfiguration(tree, `test-app`);
    testAppConfig.targets = testAppConfig.targets || {};
    testAppConfig.targets.build.options = {};
    updateProjectConfiguration(tree, `test-app`, testAppConfig);
    testE2eAppConfig = readProjectConfiguration(tree, `test-app-e2e`);
    delete testE2eAppConfig.targets?.e2e.options.baseUrl;
    updateProjectConfiguration(tree, `test-app-e2e`, testE2eAppConfig);
    await configureStorybook(tree, { name: 'test-app' });
    expect(
      readProjectConfiguration(tree, `test-app`).targets?.build.options.styles
        .length
    ).toBeGreaterThan(0);
    expect(
      readProjectConfiguration(tree, `test-app-e2e`).targets?.e2e.options
        .devServerTarget
    ).toEqual('test-app:storybook');
  });

  it('should configure storybook tsconfig', async () => {
    const { tree } = setupTest();
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
    updateJson(
      tree,
      `apps/test-app/tsconfig.app.json`,
      (tsConfig: TsConfig) => {
        tsConfig.exclude = [];
        return tsConfig;
      }
    );
    await configureStorybook(tree, { name: 'test-app' });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
    expect(
      JSON.parse(tree.read(`apps/test-app/tsconfig.app.json`, 'utf-8') || '{}')
        .exclude
    ).toEqual(['jest.config.ts']);
  });

  it('should configure storybook tsconfig, add include and exclude', async () => {
    const { tree } = setupTest();
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
        tsconfig.exclude =
          tsconfig.exclude?.filter((e) => e !== 'jest.config.ts') || [];
        return tsconfig;
      }
    );
    await configureStorybook(tree, { name: 'test-app' });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      JSON.parse(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tree.read(`apps/test-app/.storybook/tsconfig.json`)!.toString()
      ).include
    ).toBeTruthy();
  });

  it('should error for missing e2e project', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, {
      name: `test-app`,
      e2eTestRunner: E2eTestRunner.None,
    });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    await expect(
      configureStorybook(tree, { name: 'test-app' })
    ).rejects.toThrowError(`Project "test-app-e2e" does not exist`);
  });

  it('should error for e2e project without cypress', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await applicationGenerator(tree, {
      name: `test-app`,
      e2eTestRunner: E2eTestRunner.None,
    });
    await applicationGenerator(tree, {
      name: `test-app-e2e`,
      e2eTestRunner: E2eTestRunner.None,
    });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: `test-app`,
    });
    await expect(
      configureStorybook(tree, { name: 'test-app' })
    ).rejects.toThrowError(
      `Project "test-app-e2e" does not have an e2e target with @nrwl/cypress:cypress`
    );
  });
});
