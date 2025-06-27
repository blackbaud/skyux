import { storybookConfigurationGenerator } from '@nx/angular/generators';
import { NxJsonConfiguration, readNxJson, updateNxJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Linter } from '@nx/eslint';

import { createTestApplication } from '../../utils/testing';
import configureStorybook from '../configure-storybook';

import generateStorybookComposition from './index';

describe('storybook-composition', () => {
  function setupTest() {
    const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write('.gitignore', '#');
    const nxJson: NxJsonConfiguration = readNxJson(tree) || {};
    nxJson.workspaceLayout = {
      appsDir: 'apps',
      libsDir: 'libs',
    };
    updateNxJson(tree, nxJson);

    tree.write('.gitignore', '');

    return { tree };
  }

  it('should create composition', async () => {
    const { tree } = setupTest();
    for (const name of ['storybook', 'test-app']) {
      await createTestApplication(tree, { name, e2eTestRunner: true });
      await storybookConfigurationGenerator(tree, {
        interactionTests: false,
        skipFormat: true,
        generateStories: false,
        linter: Linter.None,
        project: name,
      });
      await configureStorybook(tree, { name, skipFormat: true });
    }
    const storybookMain = 'apps/storybook/.storybook/main.ts';
    expect(tree.isFile(storybookMain)).toBeTruthy();
    expect(tree.read(storybookMain)?.toString()).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
      skipFormat: true,
    });
    expect(tree.read(storybookMain)?.toString()).toContain('test-app');
  });

  it('should skip non-storybook project', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    for (const name of ['storybook', 'test-app']) {
      await createTestApplication(tree, { name, e2eTestRunner: true });
      if (name === 'storybook') {
        await storybookConfigurationGenerator(tree, {
          interactionTests: false,
          skipFormat: true,
          generateStories: false,
          linter: Linter.None,
          project: name,
        });
        await configureStorybook(tree, { name, skipFormat: true });
      }
    }
    const storybookMain = 'apps/storybook/.storybook/main.ts';
    expect(tree.read(storybookMain, 'utf-8')).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain, 'utf-8')).not.toContain('test-app');
  });

  it('should error without storybook project', async () => {
    const { tree } = setupTest();
    const spy = jest.spyOn(console, 'error');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
      ansiColor: false,
    });
    expect(spy).toHaveBeenCalledWith(
      `Unable to load a project named "storybook"`,
    );
    await createTestApplication(tree, {
      name: 'storybook',
      e2eTestRunner: true,
    });
    await storybookConfigurationGenerator(tree, {
      interactionTests: false,
      skipFormat: true,
      generateStories: false,
      linter: Linter.None,
      project: 'storybook',
    });
    await configureStorybook(tree, { name: 'storybook', skipFormat: true });
    await generateStorybookComposition(tree, {
      projectsJson: '["test-app]',
      baseUrl: '../storybooks',
    });
    await generateStorybookComposition(tree, {
      projectsJson: '["test-app]',
      baseUrl: '../storybooks',
      ansiColor: false,
    });
    expect(spy).toHaveBeenCalledWith(
      `Unable to parse projectsJson: ["test-app]`,
    );
  });

  it('should handle parameters without quotes', async () => {
    const { tree } = setupTest();
    tree.write('.gitignore', '#');
    for (const name of [
      'storybook',
      'test-app-one',
      'test-app-two',
      'test-app-three',
    ]) {
      await createTestApplication(tree, { name, e2eTestRunner: true });
      await storybookConfigurationGenerator(tree, {
        interactionTests: false,
        skipFormat: true,
        generateStories: false,
        linter: Linter.None,
        project: name,
      });
      await configureStorybook(tree, { name, skipFormat: true });
    }
    const storybookMain = 'apps/storybook/.storybook/main.ts';
    expect(tree.isFile(storybookMain)).toBeTruthy();
    expect(tree.read(storybookMain, 'utf-8')).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: '[test-app-one, test-app-two]',
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain, 'utf-8')).toContain('test-app-one');
    await generateStorybookComposition(tree, {
      projectsJson: 'test-app-one, test-app-two, test-app-three',
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain, 'utf-8')).toContain('test-app-three');
  });
});
