import {
  ProjectDefinition,
  WorkspaceDefinition,
  WorkspaceHost,
  readWorkspace,
  writeWorkspace,
} from '@angular-devkit/core/src/workspace';
import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';

import { readRequiredFile } from './tree';

/**
 * Creates a workspace host.
 * Taken from: https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
 */
function createHost(tree: Tree): WorkspaceHost {
  return {
    /* istanbul ignore next */
    async readFile(path: string): Promise<string> {
      return readRequiredFile(tree, path);
    },
    /* istanbul ignore next */
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

/**
 * Returns the workspace host and project config (angular.json).
 */
export async function getWorkspace(tree: Tree): Promise<{
  host: WorkspaceHost;
  workspace: WorkspaceDefinition;
}> {
  const host = createHost(tree);
  const { workspace } = await readWorkspace('/', host);
  return { host, workspace };
}

export async function getProject(
  workspace: WorkspaceDefinition,
  projectName: string
): Promise<{ project: ProjectDefinition; projectName: string }> {
  const project = workspace.projects.get(projectName);
  if (!project) {
    throw new SchematicsException(
      `The "${projectName}" project is not defined in angular.json. Provide a valid project name.`
    );
  }

  return { project, projectName };
}

/**
 * Allows updates to the Angular project config (angular.json).
 */
export function updateWorkspace(
  updater: (workspace: WorkspaceDefinition) => void | Promise<void>
): Rule {
  return async (tree) => {
    const { host, workspace } = await getWorkspace(tree);

    // Send the workspace to the callback to allow it to be modified.
    await updater(workspace);

    // Update the workspace config with any changes.
    await writeWorkspace(workspace, host);
  };
}

/**
 * Returns the project definition corresponding to the provided name, or throws an
 * error if the project is not found.
 */
export async function getRequiredProject(
  tree: Tree,
  projectName: string | undefined
): Promise<{ projectName: string; project: ProjectDefinition }> {
  if (!projectName) {
    throw new Error('A project name is required.');
  }

  const { workspace } = await getWorkspace(tree);
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new Error(
      `The project '${projectName}' was not found in the workspace configuration.`
    );
  }

  return { projectName, project };
}
