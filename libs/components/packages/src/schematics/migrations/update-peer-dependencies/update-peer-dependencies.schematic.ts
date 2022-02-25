import { workspaces } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import { getProject, getWorkspace } from '../../utility/workspace';

function updateDependencySection(
  context: SchematicContext,
  project: workspaces.ProjectDefinition,
  tree: Tree,
  section: string
): void {
  const libraryPackageJsonPath = `${project.root}/package.json`;

  const libraryPackageJson = JSON.parse(
    readRequiredFile(tree, libraryPackageJsonPath)
  );

  const rootPackageJson = JSON.parse(readRequiredFile(tree, 'package.json'));

  if (libraryPackageJson[section]) {
    for (const packageName in libraryPackageJson[section]) {
      const rootVersion = rootPackageJson.dependencies[packageName];
      if (rootVersion.match(/^(\^|~)/)) {
        context.logger.warn(
          `Package "${packageName}@${rootVersion}" was not set to a specific version in the root 'package.json'. Skipping update to library 'package.json'.`
        );
        break;
      }

      const rangeMatch =
        libraryPackageJson[section][packageName].match(/^(\^|~)/);
      const rangeCharacter = rangeMatch ? rangeMatch[0] : '';

      libraryPackageJson[section][
        packageName
      ] = `${rangeCharacter}${rootVersion}`;
    }

    tree.overwrite(
      libraryPackageJsonPath,
      JSON.stringify(libraryPackageJson, undefined, 2)
    );
  }
}

export default function updateLibraryDependencies(): Rule {
  return async (tree, context) => {
    const { workspace } = await getWorkspace(tree);

    const { project } = await getProject(
      workspace,
      workspace.extensions.defaultProject as string
    );

    // Only run for libraries.
    /* istanbul ignore if */
    if (project.extensions.projectType !== 'library') {
      context.logger.info(
        'The default project is of type "application". Skipping.'
      );
      return;
    }

    updateDependencySection(context, project, tree, 'peerDependencies');
    updateDependencySection(context, project, tree, 'dependencies');
  };
}
