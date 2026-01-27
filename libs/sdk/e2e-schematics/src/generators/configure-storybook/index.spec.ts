import { storybookConfigurationGenerator } from '@nx/angular/generators';
import {
  NxJsonConfiguration,
  Tree,
  readNxJson,
  readProjectConfiguration,
  updateNxJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { TsConfig } from '@nx/storybook/src/utils/utilities';

import { updateProjectConfiguration } from 'nx/src/generators/utils/project-configuration';

import { createTestApplication } from '../../utils/testing';
import { updateJson } from '../../utils/update-json';

import configureStorybook from './index';

describe('configure-storybook', () => {
  let warnSpy: jest.SpyInstance;

  function setupTest(): { tree: Tree } {
    warnSpy = jest.spyOn(console, 'warn');
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
    await createTestApplication(tree, {
      name: `test-app`,
      e2eTestRunner: true,
      unitTestRunner: true,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(tree.exists(`apps/test-app/.storybook/preview.js`)).toBeFalsy();
    expect(tree.exists(`apps/test-app/.storybook/preview.ts`)).toBeTruthy();
    expect(tree.read(`apps/test-app/.storybook/preview.ts`, 'utf-8')).toContain(
      `import { moduleMetadata } from '@storybook/angular';`,
    );
    const e2eConfig = readProjectConfiguration(tree, `test-app-e2e`);
    expect(e2eConfig.targets?.['e2e'].options.devServerTarget).toEqual(
      `test-app:storybook`,
    );
    let testAppConfig = readProjectConfiguration(tree, `test-app`);
    delete testAppConfig.targets?.['build'].options;
    updateProjectConfiguration(tree, `test-app`, testAppConfig);
    let testE2eAppConfig = readProjectConfiguration(tree, `test-app-e2e`);
    delete testE2eAppConfig.targets?.['e2e'].configurations;
    updateProjectConfiguration(tree, `test-app-e2e`, testE2eAppConfig);
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    const buildConfig = readProjectConfiguration(tree, `test-app`).targets?.[
      'build'
    ];
    expect(buildConfig?.options?.styles.length).toBeGreaterThan(0);
    testAppConfig = readProjectConfiguration(tree, `test-app`);
    testAppConfig.targets = testAppConfig.targets || {};
    testAppConfig.targets['build'].options = {};
    updateProjectConfiguration(tree, `test-app`, testAppConfig);
    testE2eAppConfig = readProjectConfiguration(tree, `test-app-e2e`);
    delete testE2eAppConfig.targets?.['e2e'].options.baseUrl;
    updateProjectConfiguration(tree, `test-app-e2e`, testE2eAppConfig);
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(
      readProjectConfiguration(tree, `test-app`).targets?.['build']?.options
        ?.styles.length,
    ).toBeGreaterThan(0);
    expect(
      readProjectConfiguration(tree, `test-app-e2e`).targets?.['e2e'].options
        .devServerTarget,
    ).toEqual('test-app:storybook');
  });

  it('should configure storybook tsconfig', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: `test-app`,
      e2eTestRunner: true,
      unitTestRunner: true,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    tree.delete(`apps/test-app/.storybook/tsconfig.json`);
    updateJson(
      tree,
      `apps/test-app/tsconfig.app.json`,
      (tsConfig: TsConfig) => {
        tsConfig.exclude = [];
        return tsConfig;
      },
    );
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
    expect(
      JSON.parse(tree.read(`apps/test-app/tsconfig.app.json`, 'utf-8') || '{}')
        .exclude,
    ).toEqual([]);
  });

  it('should configure storybook tsconfig, add include and exclude', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: `test-app`,
      e2eTestRunner: true,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    updateJson<TsConfig>(
      tree,
      `apps/test-app/.storybook/tsconfig.json`,
      (tsconfig) => {
        delete tsconfig.include;
        tsconfig.exclude =
          tsconfig.exclude?.filter((e) => e !== 'jest.config.ts') || [];
        return tsconfig;
      },
    );
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(tree.exists(`apps/test-app/.storybook/tsconfig.json`)).toBeTruthy();
    expect(
      JSON.parse(
        tree.read(`apps/test-app/.storybook/tsconfig.json`, 'utf-8') ?? '{}',
      ).include,
    ).toBeTruthy();
  });

  it('should add jest.config.ts to exclude when it exists and is not already excluded', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: `test-app`,
      e2eTestRunner: true,
      unitTestRunner: true,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    // Create jest.config.ts file to trigger the exclude logic
    tree.write('apps/test-app/jest.config.ts', 'export default {};');
    // Set up tsconfig with exclude array that doesn't include jest.config.ts
    updateJson<TsConfig>(
      tree,
      `apps/test-app/.storybook/tsconfig.json`,
      (tsconfig) => {
        tsconfig.exclude = ['../**/*.spec.ts'];
        return tsconfig;
      },
    );
    updateJson<TsConfig>(
      tree,
      `apps/test-app/tsconfig.app.json`,
      (tsconfig) => {
        tsconfig.exclude = ['**/*.spec.ts'];
        return tsconfig;
      },
    );
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    const storybookTsconfig = JSON.parse(
      tree.read(`apps/test-app/.storybook/tsconfig.json`, 'utf-8') ?? '{}',
    );
    const appTsconfig = JSON.parse(
      tree.read(`apps/test-app/tsconfig.app.json`, 'utf-8') ?? '{}',
    );
    expect(storybookTsconfig.exclude).toContain('jest.config.ts');
    expect(appTsconfig.exclude).toContain('jest.config.ts');
  });

  it('should error for missing e2e project', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: `test-app`,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(warnSpy).toHaveBeenCalledWith(
      `Project "test-app-e2e" does not exist`,
    );
  });

  it('should error for e2e project without cypress', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    await createTestApplication(tree, {
      name: `test-app`,
      e2eTestRunner: false,
    });
    await createTestApplication(tree, {
      name: `test-app-e2e`,
      e2eTestRunner: false,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: 'none',
      project: `test-app`,
    });
    await configureStorybook(tree, { name: 'test-app', skipFormat: true });
    expect(warnSpy).toHaveBeenCalledWith(
      `Project "test-app-e2e" does not have an e2e target with @nx/cypress:cypress`,
    );
  });
});
