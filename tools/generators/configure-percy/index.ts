import type { Tree } from '@nrwl/devkit';
import {
  formatFiles,
  joinPathFragments,
  logger,
  updateJson,
} from '@nrwl/devkit';
import { insertStatement } from '@nrwl/workspace/src/generators/utils/insert-statement';

import { someOrAllE2eProjects } from '../../utils/some-or-all-projects';

export async function configurePercy(tree: Tree, schema: any) {
  const projects = someOrAllE2eProjects(tree, schema.name);
  projects.forEach((project) => {
    const cypressJsonPath = joinPathFragments(project.root, 'cypress.json');
    if (!tree.isFile(cypressJsonPath)) {
      logger.info(`Did not find cypress in project.`);
      return;
    }
    updateJson(tree, cypressJsonPath, (cypressConfig) => {
      cypressConfig.video = false;

      if (!cypressConfig.supportFile) {
        logger.info(`Did not find cypress support file.`);
      } else {
        const filePath = joinPathFragments(
          project.root,
          cypressConfig.supportFile
        );
        const importPercyCypress = `import '@percy/cypress';`;
        if (!tree.isFile(filePath)) {
          tree.write(filePath, importPercyCypress);
        } else {
          const content = tree.read(filePath).toString();
          if (!content.includes(importPercyCypress)) {
            insertStatement(tree, filePath, importPercyCypress);
          }
        }
      }
      return cypressConfig;
    });
  });

  return formatFiles(tree);
}

export default configurePercy;
