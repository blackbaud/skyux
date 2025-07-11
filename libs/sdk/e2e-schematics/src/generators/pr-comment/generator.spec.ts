import { Tree } from '@nx/devkit';

import { createTree } from 'nx/src/generators/testing-utils/create-tree';

import generator from './generator';
import { PrCommentGeneratorSchema } from './schema';

describe('pr-comment generator', () => {
  let appTree: Tree;
  const options: PrCommentGeneratorSchema = {
    pr: '123',
    storybooks: 'storybook-1,storybook-2',
  };

  beforeEach(() => {
    appTree = createTree();
  });

  it('should generate files', async () => {
    await generator(appTree, options);
    expect(appTree.isFile('dist/pr_comment.md')).toBeTruthy();
    expect(appTree.read('dist/pr_comment.md', 'utf-8')).toMatchSnapshot(
      'dist/pr_comment.md',
    );
    expect(appTree.isFile('dist/README.md')).toBeTruthy();
    expect(appTree.read('dist/README.md', 'utf-8')).toMatchSnapshot(
      'dist/README.md',
    );
  });

  it('should generate files for another repository', async () => {
    await generator(appTree, {
      ...options,
      pr: 'icons-456',
      repository: 'blackbaud/skyux-icons',
    });
    expect(appTree.isFile('dist/pr_comment.md')).toBeTruthy();
    expect(appTree.read('dist/pr_comment.md', 'utf-8')).toMatchSnapshot(
      'dist/pr_comment.md',
    );
    expect(appTree.isFile('dist/README.md')).toBeTruthy();
    expect(appTree.read('dist/README.md', 'utf-8')).toMatchSnapshot(
      'dist/README.md',
    );
  });

  it('should generate files with apps', async () => {
    await generator(appTree, {
      ...options,
      apps: 'app-1,app-2',
    });
    expect(appTree.isFile('dist/pr_comment.md')).toBeTruthy();
    expect(appTree.read('dist/pr_comment.md', 'utf-8')).toMatchSnapshot(
      'dist/pr_comment.md',
    );
    expect(appTree.isFile('dist/README.md')).toBeTruthy();
    expect(appTree.read('dist/README.md', 'utf-8')).toMatchSnapshot(
      'dist/README.md',
    );
  });

  it('should generate files with no storybooks', async () => {
    await generator(appTree, {
      ...options,
      storybooks: '',
      apps: 'app-1,app-2',
    });
    expect(appTree.isFile('dist/pr_comment.md')).toBeTruthy();
    expect(appTree.read('dist/pr_comment.md', 'utf-8')).toMatchSnapshot(
      'dist/pr_comment.md',
    );
    expect(appTree.isFile('dist/README.md')).toBeTruthy();
    expect(appTree.read('dist/README.md', 'utf-8')).toMatchSnapshot(
      'dist/README.md',
    );
  });

  it('should throw errors', async () => {
    await expect(
      generator(appTree, {
        ...options,
        pr: '',
      }),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});
