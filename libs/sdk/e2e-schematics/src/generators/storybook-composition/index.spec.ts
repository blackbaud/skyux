import {
  applicationGenerator,
  storybookConfigurationGenerator,
} from '@nrwl/angular/generators';
import { Linter } from '@nrwl/linter';

import { createTreeWithEmptyWorkspace } from 'nx/src/generators/testing-utils/create-tree-with-empty-workspace';

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
    expect(tree.read(storybookMain).toString()).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain).toString()).toContain('test-app');
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
    expect(tree.read(storybookMain).toString()).not.toContain('test-app');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    expect(tree.read(storybookMain).toString()).not.toContain('test-app');
  });

  it('should error without storybook project', async () => {
    const tree = createTreeWithEmptyWorkspace();
    const spy = jest.spyOn(console, 'error');
    await generateStorybookComposition(tree, {
      projectsJson: JSON.stringify(['test-app']),
      baseUrl: '../storybooks',
    });
    expect(spy).toHaveBeenCalled();
  });
});
