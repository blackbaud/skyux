import { libraryGenerator } from '@nrwl/angular/generators';
import { UnitTestRunner } from '@nrwl/angular/src/utils/test-runners';
import {
  Tree,
  joinPathFragments,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Linter } from '@nrwl/linter';

import generator from './index';

describe('init generator', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await libraryGenerator(appTree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    await generator(appTree, { ansiColor: false });
    const config = readProjectConfiguration(appTree, 'storybook');
    expect(config.targets?.storybook).toBeDefined();
    expect(
      appTree.isFile(
        joinPathFragments(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          config.sourceRoot!,
          'lib/preview-wrapper/preview-wrapper-decorators.ts'
        )
      )
    ).toBeTruthy();
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      appTree.read(joinPathFragments(config.sourceRoot!, 'index.ts'), 'utf-8')
    ).toMatchSnapshot();
  });

  it('should error without a "storybook" project', async () => {
    try {
      await generator(appTree, { ansiColor: false });
      fail('should have thrown');
    } catch (e) {
      if (!(e instanceof Error)) {
        fail('should have thrown an error');
      }
      expect(e.message).toBe(
        'Storybook project or storybook project information not found'
      );
    }
  });

  it('should skip on subsequent runs', async () => {
    await libraryGenerator(appTree, {
      name: 'storybook',
      routing: false,
      unitTestRunner: UnitTestRunner.None,
      linter: Linter.None,
    });
    const consoleSpy = jest.spyOn(console, 'log');
    await generator(appTree, { ansiColor: false });
    expect(appTree.isFile('libs/storybook/.storybook/preview.ts')).toBeTruthy();
    expect(consoleSpy).not.toHaveBeenCalled();
    let installTask = await generator(appTree, {});
    installTask();
    installTask = await generator(appTree, { ansiColor: false });
    installTask();
    expect(consoleSpy).toHaveBeenCalledWith(`Storybook already initialized`);
  });
});
