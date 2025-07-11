import { Tree, generateFiles, joinPathFragments } from '@nx/devkit';

import { PrCommentGeneratorOptions, PrCommentGeneratorSchema } from './schema';

function normalizeOptions(
  options: PrCommentGeneratorSchema,
): PrCommentGeneratorOptions {
  const pr = options.pr;
  const repository = options.repository || 'blackbaud/skyux';
  const storybooks = options.storybooks
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const apps = (options.apps || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const prNumber = parseInt(`${String(pr).replace(/^\w+-/, '')}`, 10);
  if (!pr || isNaN(prNumber)) {
    throw new Error('Invalid PR number');
  }
  return {
    pr,
    prNumber,
    storybooks,
    apps,
    repository,
  };
}

export default async function prComment(
  tree: Tree,
  options: PrCommentGeneratorSchema,
): Promise<void> {
  const normalizedOptions = normalizeOptions(options);
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/comment'),
    'dist',
    normalizedOptions,
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/readme'),
    'dist',
    normalizedOptions,
  );

  return await Promise.resolve();
}
