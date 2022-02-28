import { normalize, strings } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  MergeStrategy,
  Rule,
  Tree,
  apply,
  applyTemplates,
  chain,
  forEach,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

import path from 'path';

import { SkyuxVersions } from '../../shared/skyux-versions';
import { readRequiredFile } from '../../utility/tree';
import { getProject, getWorkspace } from '../../utility/workspace';

import { Schema } from './schema';
import { TemplateContext } from './template-context';

/**
 * Standardize keys to be uppercase, due to some language limitations
 * with lowercase characters.
 * See: https://stackoverflow.com/questions/234591/upper-vs-lower-case
 */
function parseLocaleIdFromFileName(fileName: string): string {
  return fileName
    .split('.json')[0]
    .split('resources_')[1]
    .toLocaleUpperCase()
    .replace('_', '-');
}

function getResources(tree: Tree, project: ProjectDefinition): string {
  let resourcesVar: string =
    'const RESOURCES: { [locale: string]: SkyLibResources } = {';

  const localesPath = normalize(`${project.sourceRoot}/assets/locales`);
  const localesDir = tree.getDir(localesPath);

  localesDir.subfiles.forEach((file) => {
    const localeId = parseLocaleIdFromFileName(file);
    const contents = JSON.parse(
      readRequiredFile(tree, `${localesPath}/${file}`)
    );

    Object.keys(contents).forEach((key) => {
      delete contents[key]._description;
    });

    resourcesVar += `\n  '${localeId}': ${JSON.stringify(contents)},`;
  });

  resourcesVar += '\n};';

  return resourcesVar;
}

/**
 * Adds `@skyux/i18n` to the project's package.json `peerDependencies`.
 */
function addI18nPeerDependency(project: ProjectDefinition): Rule {
  return (tree) => {
    const packageJsonPath = normalize(`${project.root}/package.json`);
    const packageJsonContent = readRequiredFile(tree, packageJsonPath);

    const packageJson = JSON.parse(packageJsonContent);
    packageJson.peerDependencies = packageJson.peerDependencies || {};

    if (!packageJson.peerDependencies['@skyux/i18n']) {
      packageJson.peerDependencies['@skyux/i18n'] = SkyuxVersions.I18n;
      tree.overwrite(
        packageJsonPath,
        JSON.stringify(packageJson, undefined, 2)
      );
    }
  };
}

function ensureDefaultResourcesFileExists(project: ProjectDefinition): Rule {
  return (tree) => {
    const defaultResourcePath = normalize(
      `${project.sourceRoot}/assets/locales/resources_en_US.json`
    );

    if (tree.exists(defaultResourcePath)) {
      return;
    }

    tree.create(
      defaultResourcePath,
      JSON.stringify(
        {
          hello_world: {
            _description: 'A simple message.',
            message: 'Hello, world!',
          },
        },
        undefined,
        2
      ) + '\n'
    );

    return tree;
  };
}

function generateTemplateFiles(
  project: ProjectDefinition,
  projectName: string,
  options: Schema
): Rule {
  return (tree) => {
    const modulePath = options.name || '';

    const parsedPath = path.parse(options.name || '');
    const movePath = normalize(project.sourceRoot + '/' + parsedPath.dir);

    const resources = getResources(tree, project);

    const templateContext: TemplateContext = {
      modulePath: modulePath ? ` ${modulePath}` : '',
      name: parsedPath.name || projectName,
      resources,
    };

    const templateConfig = { ...strings, ...templateContext };

    const templateSource = apply(url('./files'), [
      applyTemplates(templateConfig),
      move(movePath),
      overwriteIfExists(tree),
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

/**
 * Fixes an Angular CLI issue with merge strategies.
 * @see https://github.com/angular/angular-cli/issues/11337#issuecomment-516543220
 */
function overwriteIfExists(tree: Tree): Rule {
  return forEach((fileEntry) => {
    if (tree.exists(fileEntry.path)) {
      tree.overwrite(fileEntry.path, fileEntry.content);
      return null;
    }
    return fileEntry;
  });
}

export default function generateLibraryResourcesModule(options: Schema): Rule {
  return async (tree, context) => {
    const { workspace } = await getWorkspace(tree);

    const { project, projectName } = await getProject(
      workspace,
      options.project || (workspace.extensions.defaultProject as string)
    );

    // Abort if executed against an application.
    if (project.extensions.projectType === 'application') {
      context.logger.warn(
        `The project "${projectName}" is not of type "library". Aborting.`
      );
      return;
    }

    const rules: Rule[] = [
      addI18nPeerDependency(project),
      ensureDefaultResourcesFileExists(project),
      generateTemplateFiles(project, projectName, options),
    ];

    return chain(rules);
  };
}
