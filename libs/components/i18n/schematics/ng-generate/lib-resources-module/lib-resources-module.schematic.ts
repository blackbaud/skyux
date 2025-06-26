import { Path, dirname, normalize, strings } from '@angular-devkit/core';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import {
  MergeStrategy,
  Rule,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
} from '@angular-devkit/schematics';

import path from 'path';

import { getLocaleIdFromFileName } from '../../utility/get-locale-id-from-file-name';
import { getSkyuxVersion } from '../../utility/get-skyux-version';
import { readRequiredFile } from '../../utility/tree';
import { getProject, getWorkspace } from '../../utility/workspace';

import { Schema } from './schema';
import { TemplateContext } from './template-context';

function getLibrarySourceRoot(tree: Tree, project: ProjectDefinition): Path {
  const ngPackageJson = JSON.parse(
    readRequiredFile(tree, normalize(`${project.root}/ng-package.json`)),
  );

  const entryPath = normalize(`${project.root}/${ngPackageJson.lib.entryFile}`);

  return dirname(entryPath);
}

function getResources(tree: Tree, project: ProjectDefinition): string {
  let resourcesVar = 'const RESOURCES: Record<string, SkyLibResources> = {';

  const sourceRoot = getLibrarySourceRoot(tree, project);
  const localesPath = normalize(`${sourceRoot}/assets/locales`);
  const localesDir = tree.getDir(localesPath);

  localesDir.subfiles.forEach((file) => {
    const localeId = getLocaleIdFromFileName(file);
    const contents = JSON.parse(
      readRequiredFile(tree, `${localesPath}/${file}`),
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
      packageJson.peerDependencies['@skyux/i18n'] = `^${getSkyuxVersion()}`;
      tree.overwrite(
        packageJsonPath,
        JSON.stringify(packageJson, undefined, 2),
      );
    }
  };
}

function ensureDefaultResourcesFileExists(project: ProjectDefinition): Rule {
  return (tree) => {
    const sourceRoot = getLibrarySourceRoot(tree, project);
    const defaultResourcePath = normalize(
      `${sourceRoot}/assets/locales/resources_en_US.json`,
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
        2,
      ) + '\n',
    );

    return tree;
  };
}

function generateTemplateFiles(
  project: ProjectDefinition,
  projectName: string,
  options: Schema,
): Rule {
  return (tree) => {
    const modulePath = options.name || '';

    const sourceRoot = getLibrarySourceRoot(tree, project);
    const parsedPath = path.parse(options.name || '');
    const movePath = normalize(`${sourceRoot}/${parsedPath.dir}`);

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
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}

export default function generateLibraryResourcesModule(options: Schema): Rule {
  return async (tree, context) => {
    const { workspace } = await getWorkspace(tree);

    if (!options.project) {
      throw new Error('A project name is required.');
    }

    const { project, projectName } = await getProject(
      workspace,
      options.project,
    );

    // Abort if executed against an application.
    if (project.extensions['projectType'] === 'application') {
      context.logger.warn(
        `The project "${projectName}" is not of type "library". Aborting.`,
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
