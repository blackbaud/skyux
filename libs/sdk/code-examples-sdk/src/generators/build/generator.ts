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
  if (options.paths && options.component) {
    throw new Error(
      'The --paths and --component options are mutually exclusive. Only use one of them.'
    );
  }
  let paths: string[];
  if (options.component) {
    paths = [...options.component.split(/[ ,]+/)];
  } else if (options.paths) {
    paths = options.paths
      .split(/[\s,]+/)
      .map((path) => path.trim())
      .map((path) => path.replace(`${codeExamplesBasePath}/`, ''));
  } else {
    paths = tree
      .children(`${codeExamplesBasePath}`)
      .filter(
        (file) =>
          !file.startsWith('.') &&
          !tree.isFile(`${codeExamplesBasePath}/${file}`)
      );
  }
  const projectPaths: string[] = [];
  for (const examplePath of paths) {
    const examplePaths = findExamplePaths(
      tree,
      `${codeExamplesBasePath}/${examplePath}`
    ).map((path) => path.replace(`${codeExamplesBasePath}/`, ''));
    if (examplePaths.length === 0) {
      logger.warn(`No examples found in ${examplePath}`);
    }
    for (const examplePath of examplePaths) {
      await codeExampleSpa(tree, {
        path: examplePath,
        ltsBranch: options.ltsBranch,
        skipFormat: options.skipFormat,
      });
      projectPaths.push(examplePath);
    }
  }
  generateFiles(tree, `${__dirname}/files`, buildPath, {
    buildPath,
    offsetFromRoot,
    projectPaths,
  });

  /* istanbul ignore if */
  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export default buildCodeExamples;
