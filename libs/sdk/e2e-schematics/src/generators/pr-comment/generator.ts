import { Tree, generateFiles, joinPathFragments } from '@nx/devkit';

import { PrCommentGeneratorOptions, PrCommentGeneratorSchema } from './schema';

function normalizeOptions(
  tree: Tree,
  options: PrCommentGeneratorSchema,
): PrCommentGeneratorOptions {
  const url = options.url;
  if (!url || url.trim().length === 0) {
    throw new Error('Invalid preview URL');
  }
  const repoUrl = options.repoUrl;
  if (!repoUrl || repoUrl.trim().length === 0) {
    throw new Error('Invalid repo URL');
  }
  const pr = String(options.pr);
  const prNumber = parseInt(pr.replace(/[^0-9]/g, ''), 10);
  const storybooks = options.storybooks
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const skipCompositeStorybook = !!options.skipCompositeStorybook;
  const apps = (options.apps || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (!pr || isNaN(prNumber)) {
    throw new Error('Invalid PR number');
  }
  return {
    url,
    repoUrl,
    pr,
    prNumber,
    storybooks,
    skipCompositeStorybook,
    apps,
  };
}

export default function prComment(
  tree: Tree,
  options: PrCommentGeneratorSchema,
): void {
  const normalizedOptions = normalizeOptions(tree, options);
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    'dist',
    normalizedOptions,
  );
}
