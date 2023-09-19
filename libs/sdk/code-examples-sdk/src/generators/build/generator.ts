import {
  Tree,
  formatFiles,
  generateFiles,
  logger,
  offsetFromRoot,
} from '@nx/devkit';

import codeExampleSpa from '../code-example-spa/generator';

import { BuildGeneratorSchema } from './schema';

const codeExamplesBasePath = `apps/code-examples/src/app/code-examples`;
const buildPath = `dist/libs/sdk/code-examples-sdk`;

function findExamplePaths(tree: Tree, basePath: string): string[] {
  const children = tree.children(basePath);
  const hasDemoComponentFile = tree.exists(`${basePath}/demo.component.ts`);
  const hasModuleFile = children.some((file) => file.endsWith('.module.ts'));
  if (hasDemoComponentFile || hasModuleFile) {
    return [basePath];
  } else {
    const noFiles = !children.some((file) =>
      tree.isFile(`${basePath}/${file}`)
    );
    if (noFiles) {
      return children
        .map((file) => findExamplePaths(tree, `${basePath}/${file}`))
        .flat();
    } else {
      return [];
    }
  }
}

export async function buildCodeExamples(
  tree: Tree,
  options: BuildGeneratorSchema
) {
  let components: string[];
  if (options.component) {
    components = [...options.component.split(/[ ,]+/)];
  } else {
    components = tree
      .children(`${codeExamplesBasePath}`)
      .filter(
        (file) =>
          !file.startsWith('.') &&
          !tree.isFile(`${codeExamplesBasePath}/${file}`)
      );
  }
  const projectPaths: string[] = [];
  for (const component of components) {
    let examplePaths = findExamplePaths(
      tree,
      `${codeExamplesBasePath}/${component}`
    ).map((path) => path.replace(`${codeExamplesBasePath}/${component}/`, ''));
    if (options.path) {
      examplePaths = examplePaths.filter((path) =>
        path.startsWith(`${options.path}`)
      );
    }
    if (examplePaths.length === 0) {
      logger.warn(`No examples found for ${component}`);
    }
    for (const examplePath of examplePaths) {
      await codeExampleSpa(tree, {
        component,
        path: examplePath,
        ltsBranch: options.ltsBranch,
      });
      projectPaths.push(`${component}/${examplePath}`);
    }
  }
  generateFiles(tree, `${__dirname}/files`, buildPath, {
    buildPath,
    offsetFromRoot,
    projectPaths,
  });

  await formatFiles(tree);
}

export default buildCodeExamples;
