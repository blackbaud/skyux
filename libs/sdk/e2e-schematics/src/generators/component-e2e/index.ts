import {
  Tree,
  generateFiles,
  joinPathFragments,
  logger,
  names,
} from '@nx/devkit';

import { formatFiles } from '../../utils/format-files';

import { NormalizedSchema, Schema } from './schema';

const BASE_PATH = 'apps/e2e';

function normalizeOptions(options: Partial<Schema>): NormalizedSchema {
  if (!options.name) {
    throw new Error(`Please provide the component library name`);
  }

  const parsedTags = (
    options.tags ? options.tags.split(',').map((s) => s.trim()) : []
  )
    .filter((tag) => tag.length > 0)
    .concat(['component-e2e']);

  return {
    name: options.name,
    storybookAppName: `${options.name}-storybook`,
    parsedTags,
    tags: options.tags,
    ansiColor: options.ansiColor !== false,
    skipFormat: options.skipFormat,
  };
}

/**
 * Scaffolds a `<name>-storybook` Storybook app and a `<name>-storybook-e2e`
 * Cypress project under `apps/e2e/` from static templates. If the pair already
 * exists, the generator warns and makes no changes.
 */
export default async function (
  tree: Tree,
  schema: Partial<Schema>,
): Promise<void> {
  const options = normalizeOptions(schema);
  const storybookRoot = `${BASE_PATH}/${options.storybookAppName}`;

  if (tree.exists(`${storybookRoot}/project.json`)) {
    (options.ansiColor ? logger.warn : console.warn)(
      `The project "${options.storybookAppName}" already exists.`,
    );
    return;
  }

  const substitutions = {
    name: options.name,
    nameClass: names(options.name).className,
    tags: JSON.stringify(options.parsedTags),
    dot: '.',
    tmpl: '',
  };

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/storybook'),
    storybookRoot,
    substitutions,
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/e2e'),
    `${BASE_PATH}/${options.storybookAppName}-e2e`,
    substitutions,
  );

  await formatFiles(tree, { skipFormat: schema.skipFormat });
}
