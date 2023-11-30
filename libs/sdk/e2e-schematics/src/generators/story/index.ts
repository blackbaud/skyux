import { strings } from '@angular-devkit/core';
import { componentGenerator } from '@nx/angular/generators';
import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  normalizePath,
} from '@nx/devkit';

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
  options: ComponentGeneratorSchema,
): NormalizedSchema {
  if (!options.project) {
    throw new Error('Project name not specified');
  }

  options.name = normalizePath(options.name);
  const projects = getProjects(tree);
  const projectConfig = getStorybookProject(tree, options);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const projectDirectory = projectConfig.sourceRoot!;
  const projectName = options.project;
  const projectRoot = projectConfig.root;
  const projectTypeBase = getProjectTypeBase(projectConfig);

  if (
    tree.exists(
      joinPathFragments(projectDirectory, projectTypeBase, options.name),
    )
  ) {
    throw new Error(`${options.name} already exists for ${projectName}`);
  }
  options.cypressProject = options.cypressProject || `${projectName}-e2e`;
  const e2eProjectConfig = projects.get(options.cypressProject);

  // istanbul ignore if
  if (!e2eProjectConfig) {
    throw new Error('e2e project configuration not found');
  }

  const e2eSourceRoot = e2eProjectConfig.sourceRoot;
  let module: string | undefined;
  if (options.module) {
    module = options.module;
  } else {
    const moduleOptions = findModulePaths(tree, projectDirectory, (path) => {
      const sourceFile = readSourceFile(tree, path);
      const module = findNgModuleClass(sourceFile);
      return !!module && isRoutingModule(module, sourceFile);
    });
    if (moduleOptions.length === 0) {
      throw new Error(
        `Could not find a router module to add the component to. Please specify a module using the --module option.`,
      );
    } else if (moduleOptions.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      module = moduleOptions[0]
        .split('/')
        .pop()!
        .replace(/\.module\.ts$/, '');
    } else {
      const componentDirectory = `${projectTypeBase}${
        options.name.includes('/') ? `/${dirname(options.name)}` : ''
      }`;
      module = findClosestModule(
        moduleOptions,
        projectDirectory,
        componentDirectory,
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
    project: `${normalizedOptions.project}`,
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
      change.path.match(/\.component\.(ts|cy\.ts|spec\.ts|html|s?css)$/),
    )
    .map((change) => change.path);
  const componentFilePath = componentFilePaths.find((filepath) =>
    filepath.endsWith('.component.ts'),
  );

  // istanbul ignore if
  if (!componentFilePath) {
    throw new Error('Unable to find component file path');
  }

  // Module generator creates the component and adds the route, but it doesn't provide options or use the defaults.
  componentFilePaths.forEach((filepath) => {
    tree.delete(filepath);
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const baseName = normalizedOptions.name.split('/').pop()!;
  await componentGenerator(tree, {
    name: normalizedOptions.name,
    module: baseName,
    project: normalizedOptions.projectName,
    style: 'scss',
    displayBlock: true,
    changeDetection: 'OnPush',
    export: true,
    skipImport: true,
    skipTests: !normalizedOptions.includeTests,
  });
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    dirname(componentFilePath),
    {
      name: baseName,
      nameDash: strings.dasherize(baseName),
      nameClass: strings.classify(baseName),
      nameCapitalized: capitalizeWords(baseName),
      project: normalizedOptions.project,
      componentPath: dirname(componentFilePath),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prefix: (normalizedOptions.projectConfig as any)['prefix'],
    },
  );
  if (!normalizedOptions.includeTests) {
    tree.delete(
      `${dirname(componentFilePath)}/${strings.dasherize(
        baseName,
      )}.component.spec.ts`,
    );
  }

  // Determine paths that should be created by this generator.
  const expectedPaths = [
    `${normalizedOptions.projectDirectory}/app/${normalizedOptions.name}/**`,
  ];

  // nx g @skyux-sdk/e2e-schematics:stories
  await storiesGenerator(tree, {
    project: normalizedOptions.project,
    cypressProject: normalizedOptions.cypressProject,
    generateCypressSpecs: normalizedOptions.generateCypressSpecs,
    paths: expectedPaths,
  });

  await formatFiles(tree);
}
