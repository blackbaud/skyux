import type { Tree } from '@nx/devkit';
import { generateFiles, joinPathFragments } from '@nx/devkit';
import { insertStatement } from '@nx/workspace/src/generators/utils/insert-statement';

import { formatFiles } from '../../utils/format-files';
import { getE2eProjects } from '../../utils/get-projects';

import { Schema } from './schema';

/**
 * Disable video recording and import @percy/cypress into the e2e project, which enables the .percySnapshot method.
 */
export default async function configurePercy(
  tree: Tree,
  schema: Schema,
): Promise<void> {
  const projects = getE2eProjects(tree, schema.name);
  projects.forEach((project) => {
    // Disable video recording
    generateFiles(
      tree,
      joinPathFragments(__dirname, 'files'),
      project.root,
      {},
    );
    const filePath = joinPathFragments(project.root, 'src/support/e2e.ts');
    const importPercyCypress = `import` + ` '@percy/cypress';`;
    if (!tree.exists(filePath)) {
      tree.write(filePath, importPercyCypress);
    } else {
      const content = tree.read(filePath, 'utf-8') as string;
      if (!content.includes(importPercyCypress)) {
        insertStatement(tree, filePath, importPercyCypress);
      }
    }
  });

  await formatFiles(tree, { skipFormat: schema.skipFormat });
}
