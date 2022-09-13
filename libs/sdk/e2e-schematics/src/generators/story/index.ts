import { componentGenerator } from '@nrwl/angular/generators';
import { normalizePath } from '@nrwl/devkit';
import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
} from '@nrwl/devkit';
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';

import {
  angularModuleGenerator,
  capitalizeWords,
  dirname,
  findClosestModule,
  findModulePaths,
  findNgModuleClass,
  getProjectTypeBase,
  getStorybookProject,
  isRoutingModule,
  readSourceFile,
} from '../../utils';
import storiesGenerator from '../stories/index';

import { ComponentGeneratorSchema } from './schema';

interface NormalizedSchema extends ComponentGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  e2eSourceRoot: string | undefined;
  projectConfig: ProjectConfiguration;
  e2eProjectConfig: ProjectConfiguration;
}

function normalizeOptions(
  tree: Tree,
  options: ComponentGeneratorSchema
): NormalizedSchema {
  options.name = normalizePath(options.name);
  const projects = getProjects(tree);
  const projectConfig = getStorybookProject(tree, options);
  const projectDirectory = projectConfig.sourceRoot;
  const projectName = options.project;
  const projectRoot = projectConfig.root;
  const projectTypeBase = getProjectTypeBase(projectConfig);
  if (
    tree.exists(
      joinPathFragments(projectDirectory, projectTypeBase, options.name)
    )
  ) {
    throw new Error(`${options.name} already exists for ${projectName}`);
  }
  options.cypressProject = options.cypressProject || `${projectName}-e2e`;
  const e2eProjectConfig = projects.get(options.cypressProject);
  const e2eSourceRoot = e2eProjectConfig.sourceRoot;
  let module: string;
  if (options.module) {
    module = options.module;
  } else {
    const moduleOptions = findModulePaths(tree, projectDirectory, (path) => {
      const sourceFile = readSourceFile(tree, path);
      const module = findNgModuleClass(sourceFile);
      return module && isRoutingModule(module, sourceFile);
    });
    if (moduleOptions.length === 0) {
      throw new Error(
        `Could not find a router module to add the component to. Please specify a module using the --module option.`
      );
    } else if (moduleOptions.length === 1) {
      module = moduleOptions[0]
        .split('/')
        .pop()
        .replace(/\.module\.ts$/, '');
    } else {
      const componentDirectory = `${projectTypeBase}${
        options.name.includes('/') ? `/${dirname(options.name)}` : ''
      }`;
      module = findClosestModule(
        moduleOptions,
        projectDirectory,
        componentDirectory
      );
    }
  }

  return {
    ...options,
    module,
    projectName,
    projectRoot,
    projectDirectory,
    e2eSourceRoot,
    projectConfig,
    e2eProjectConfig,
  };
}

export default async function (tree: Tree, options: ComponentGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  // Grab previous changes so we can filter them later.
  const previouslyCreated = tree
    .listChanges()
    .filter((change) => change.type === 'CREATE')
    .map((change) => normalizePath(change.path));

  // nx g @schematics/angular:module
  await angularModuleGenerator(tree, {
    name: normalizedOptions.name,
    route: normalizedOptions.name,
    module: normalizedOptions.module,
    project: normalizedOptions.project,
  });
  const componentFilePaths = tree
    .listChanges()
    .filter((change) => change.type === 'CREATE')
    .map((change) => {
      return {
        ...change,
        path: normalizePath(change.path),
      };
    })
    .filter((change) => !previouslyCreated.includes(change.path))
    .filter((change) =>
      change.path.match(/\.component\.(ts|spec\.ts|html|s?css)$/)
    )
    .map((change) => change.path);
  const componentFilePath = componentFilePaths.find((filepath) =>
    filepath.endsWith('.component.ts')
  );
  // Module generator creates the component and adds the route, but it doesn't provide options or use the defaults.
  componentFilePaths.forEach((filepath) => {
    tree.delete(filepath);
  });
  const baseName = normalizedOptions.name.split('/').pop();
  await componentGenerator(tree, {
    name: normalizedOptions.name,
    module: baseName,
    project: normalizedOptions.project,
    style: 'scss',
    displayBlock: true,
    changeDetection: 'OnPush',
    export: true,
    skipImport: true,
  });
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    dirname(componentFilePath),
    {
      name: baseName,
      nameDash: dasherize(baseName),
      nameClass: classify(baseName),
      nameCapitalized: capitalizeWords(baseName),
      project: normalizedOptions.project,
      componentPath: dirname(componentFilePath),
      prefix: normalizedOptions.projectConfig['prefix'],
    }
  );

  // Determine paths that should be created by this generator.
  const expectedPaths = [
    `${normalizedOptions.projectDirectory}/app/${normalizedOptions.name}/`,
    `${normalizedOptions.e2eSourceRoot}/integration/${componentFilePath
      .split('/')
      .pop()
      .replace(/\.ts$/, '.spec.ts')}`,
  ];

  // nx g @skyux-sdk/e2e-schematics:stories
  await storiesGenerator(tree, {
    project: normalizedOptions.project,
    cypressProject: normalizedOptions.cypressProject,
    generateCypressSpecs: normalizedOptions.generateCypressSpecs,
    paths: expectedPaths,
  });

  // Find new files that are not related to the new component and drop them.
  const changes = tree.listChanges();
  changes
    .filter((change) => change.type === 'CREATE')
    .filter((change) => !previouslyCreated.includes(change.path))
    .forEach((change) => {
      if (
        expectedPaths.findIndex((expectedPath) =>
          change.path.startsWith(expectedPath)
        ) === -1
      ) {
        tree.delete(change.path);
      }
    });

  await formatFiles(tree);
}
