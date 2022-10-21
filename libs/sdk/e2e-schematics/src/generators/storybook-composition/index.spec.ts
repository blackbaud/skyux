import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import configureStorybook from '../configure-storybook';

import generateStorybookComposition from './index';

describe('storybook-composition', () => {
  it('should create composition', async () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '#');
    for (const name of ['storybook', 'test-app']) {
      await applicationGenerator(tree, { name });
      await storybookConfigurationGenerator(tree, {
        configureCypress: false,
        generateCypressSpecs: false,
        generateStories: false,
        linter: Linter.None,
        name,
      });
      await configureStorybook(tree, { name });
    }
    const storybookMain = 'apps/storybook/.storybook/main.ts';
    expect(tree.isFile(storybookMain)).toBeTruthy();
    expect(tree.read(storybookMain)?.toString()).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain)?.toString()).toContain('test-app');
  });

  it('should skip non-storybook project', async () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '#');
    for (const name of ['storybook', 'test-app']) {
      await applicationGenerator(tree, { name });
      if (name === 'storybook') {
        await storybookConfigurationGenerator(tree, {
          configureCypress: false,
          generateCypressSpecs: false,
          generateStories: false,
          linter: Linter.None,
          name,
        });
        await configureStorybook(tree, { name });
      }
    }
    const storybookMain = 'apps/storybook/.storybook/main.ts';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(tree.read(storybookMain)!.toString()).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(tree.read(storybookMain)!.toString()).not.toContain('test-app');
  });

  it('should error without storybook project', async () => {
    const tree = createTreeWithEmptyWorkspace();
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
      `Unable to load a project named "storybook"`
    );
    await applicationGenerator(tree, { name: 'storybook' });
    await storybookConfigurationGenerator(tree, {
      configureCypress: false,
      generateCypressSpecs: false,
      generateStories: false,
      linter: Linter.None,
      name: 'storybook',
    });
    await configureStorybook(tree, { name: 'storybook' });
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
      `Unable to parse projectsJson: ["test-app]`
    );
  });

  it('should handle parameters without quotes', async () => {
    const tree = createTreeWithEmptyWorkspace();
    tree.write('.gitignore', '#');
    for (const name of [
      'storybook',
      'test-app-one',
      'test-app-two',
      'test-app-three',
    ]) {
      await applicationGenerator(tree, { name });
      await storybookConfigurationGenerator(tree, {
        configureCypress: false,
        generateCypressSpecs: false,
        generateStories: false,
        linter: Linter.None,
        name,
      });
      await configureStorybook(tree, { name });
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
