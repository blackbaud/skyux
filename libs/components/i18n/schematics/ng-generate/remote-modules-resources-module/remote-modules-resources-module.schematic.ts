import { join, normalize } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  MergeStrategy,
  Rule,
  SchematicsException,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

import { getLocaleIdFromFileName } from '../../utility/get-locale-id-from-file-name';
import { getProject, getWorkspace } from '../../utility/workspace';

import { Schema } from './schema';

interface TemplateConfig {
  resources: string;
  resourcesImports: string;
}

function getRemoteModulesRoot(project: ProjectDefinition): string {
  return join(
    normalize(project.sourceRoot ?? `${project.root}/src`),
    'remote-modules',
  );
}

function getResources(
  tree: Tree,
  project: ProjectDefinition,
): { resources: string; resourcesImports: string } {
  const files = tree.getDir(
    `${getRemoteModulesRoot(project)}/assets/locales`,
  ).subfiles;

  let resources =
    'const RESOURCES: Record<string, SkyRemoteModulesResources> = {';
  let resourcesImports = '';

  for (const file of files) {
    const localeId = getLocaleIdFromFileName(file);
    const importName = `${localeId.toLocaleLowerCase().replace('-', '_')}_resources`;

    resourcesImports += `import ${importName} from './assets/locales/${file}';`;
    resources += `\n  '${localeId}': ${importName},`;
  }

  resources += '\n};';

  return { resources, resourcesImports };
}

function ensureDefaultResources(project: ProjectDefinition): Rule {
  return (tree) => {
    const defaultResourcesPath = `${getRemoteModulesRoot(project)}/assets/locales/resources_en_US.json`;

    if (!tree.exists(defaultResourcesPath)) {
      tree.create(defaultResourcesPath, '{}');
    }
  };
}

function generateTemplateFiles(project: ProjectDefinition): Rule {
  return (tree) => {
    const { resources, resourcesImports } = getResources(tree, project);

    const templateConfig: TemplateConfig = {
      resources,
      resourcesImports,
    };

    const movePath = getRemoteModulesRoot(project);

    const templateSource = apply(url('./files'), [
      applyTemplates(templateConfig),
      move(movePath),
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

export default function generateRemoteModulesResourcesModule(
  options: Schema,
): Rule {
  return async (tree) => {
    if (!options.project) {
      throw new Error('A project name is required.');
    }

    const { workspace } = await getWorkspace(tree);
    const { project, projectName } = await getProject(
      workspace,
      options.project,
    );

    if (project.extensions['projectType'] !== 'application') {
      throw new SchematicsException(
        `The project "${projectName}" is not of type "application". Aborting.`,
      );
    }

    return chain([
      ensureDefaultResources(project),
      generateTemplateFiles(project),
    ]);
  };
}
