import type { Tree } from '@nrwl/devkit';
import {
  formatFiles,
  getProjects,
  joinPathFragments,
  logger,
} from '@nrwl/devkit';

export default async function (tree: Tree, schema: any) {
  const project = getProjects(tree).get(schema.name);
  if (project) {
    const cypressJsonPath = joinPathFragments(project.root, 'cypress.json');
    if (!tree.exists(cypressJsonPath)) {
      logger.info(`Did not find cypress in project.`);
      return tree;
    }
    const cypressConfig = JSON.parse(tree.read(cypressJsonPath).toString());
    const filePath = joinPathFragments(project.root, cypressConfig.supportFile);
    if (!cypressConfig.supportFile) {
      logger.info(`Did not find cypress support file.`);
      return tree;
    }
    if (!tree.exists(filePath)) {
      tree.write(filePath, `import '@percy/cypress';\n`);
    } else {
      const importSource = '@percy/cypress';
      const content = tree.read(filePath).toString();
      if (!content.includes(`@percy/cypress`)) {
        logger.info(`Adding ${importSource} import`);
        tree.write(filePath, `import '@percy/cypress';\n\n${content}`);
      }
    }
  }
  return formatFiles(tree);
}
