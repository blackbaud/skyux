import { strings } from '@angular-devkit/core';
import {
  ProjectConfiguration,
  Tree,
  generateFiles,
  getProjects,
  joinPathFragments,
  normalizePath,
} from '@nx/devkit';

import { formatFiles } from '../../utils/format-files';
import {
  getProjectTypeBase,
  getStorybookProject,
} from '../../utils/get-projects';
import { basename, capitalizeWords } from '../../utils/utils';

import { ComponentGeneratorSchema } from './schema';

type AngularProjectConfiguration = ProjectConfiguration & {
  prefix?: string;
};

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
    tree.exists(
      joinPathFragments(
        basePath,
        `${strings.dasherize(basename(options.name))}.component.ts`,
      ),
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

  const e2eSourceRoot =
    e2eProjectConfig.sourceRoot ??
    joinPathFragments(e2eProjectConfig.root, 'src');

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    e2eSourceRoot,
    projectConfig,
    e2eProjectConfig,
  };
}

export default async function (
  tree: Tree,
  options: ComponentGeneratorSchema,
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
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
    },
  );

  await formatFiles(tree, { skipFormat: options.skipFormat });
}
