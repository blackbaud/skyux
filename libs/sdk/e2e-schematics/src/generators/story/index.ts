import { strings } from '@angular-devkit/core';
import type { AngularProjectConfiguration } from '@nx/angular/src/utils/types';
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
  basename,
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

import { ComponentGeneratorSchema } from './schema';

interface NormalizedSchema extends ComponentGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  e2eSourceRoot: string;
  projectConfig: AngularProjectConfiguration;
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
  options.standalone ??= !options.module;
  const projects = getProjects(tree);
  const projectConfig = getStorybookProject(tree, options);
  const projectDirectory =
    projectConfig.sourceRoot ?? joinPathFragments(projectConfig.root, 'src');
  const projectName = options.project;
  const projectRoot = projectConfig.root;
  const projectTypeBase = getProjectTypeBase(projectConfig);

  const basePath = joinPathFragments(
    projectDirectory,
    projectTypeBase,
    options.name,
  );
  if (
    tree.exists(joinPathFragments(basePath, `${options.name}.component.ts`))
  ) {
    throw new Error(`${options.name} already exists for ${projectName}`);
  }
  options.cypressProject = options.cypressProject || `${projectName}-e2e`;
  const e2eProjectConfig = projects.get(options.cypressProject);

  // istanbul ignore if
  if (!e2eProjectConfig) {
    throw new Error('e2e project configuration not found');
  }

  const e2eSourceRoot =
    e2eProjectConfig.sourceRoot ??
    joinPathFragments(e2eProjectConfig.root, 'src');
  let module: string | undefined;
  if (options.module) {
    module = options.module;
  } else if (!options.standalone) {
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

  if (!options.standalone) {
    // nx g @schematics/angular:module
    await angularModuleGenerator(tree, {
      name: normalizedOptions.name,
      route: normalizedOptions.name,
      module: normalizedOptions.module,
      project: `${normalizedOptions.project}`,
    });
  }
  const baseName = basename(normalizedOptions.name);

  const componentPath = joinPathFragments(
    normalizedOptions.projectDirectory,
    'app',
    strings.dasherize(normalizedOptions.name),
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/component'),
    componentPath,
    {
      name: baseName,
      nameDash: strings.dasherize(baseName),
      nameClass: strings.classify(baseName),
      nameCapitalized: capitalizeWords(baseName),
      project: normalizedOptions.project,
      componentPath,
      prefix: normalizedOptions.projectConfig.prefix,
      standalone: options.standalone,
    },
  );
  if (!normalizedOptions.includeTests) {
    tree.delete(
      `${componentPath}/${strings.dasherize(baseName)}.component.spec.ts`,
    );
  }

  const componentE2ePath = joinPathFragments(
    normalizedOptions.e2eSourceRoot,
    'e2e',
    strings.dasherize(normalizedOptions.name),
  );
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files/e2e'),
    componentE2ePath,
    {
      name: baseName,
      nameDash: strings.dasherize(baseName),
      nameClass: strings.classify(baseName),
      nameCapitalized: capitalizeWords(baseName),
      project: normalizedOptions.project,
      componentPath,
      prefix: normalizedOptions.projectConfig.prefix,
      standalone: options.standalone,
    },
  );

  await formatFiles(tree);
}
