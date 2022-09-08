import { Tree, generateFiles, joinPathFragments } from '@nrwl/devkit';

import { PrCommentGeneratorOptions, PrCommentGeneratorSchema } from './schema';

function normalizeOptions(
  tree: Tree,
  options: PrCommentGeneratorSchema
): PrCommentGeneratorOptions {
  const pr = options.pr;
  const storybooks = options.storybooks
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const apps = (options.apps || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (!pr || isNaN(parseInt(`${pr}`, 10))) {
    throw new Error('Invalid PR number');
  }
  const baseUrl =
    options.baseUrl || `https://blackbaud.github.io/skyux-pr-preview/${pr}`;
  return {
    pr,
    storybooks,
    apps,
    baseUrl,
  };
}

export default async function prComment(
  tree: Tree,
  options: PrCommentGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/comment'),
    'dist',
    normalizedOptions
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/readme'),
    'dist',
    normalizedOptions
  );
}
