import { workspaces } from '@angular-devkit/core';
import { Rule, SchematicsException, Tree } from '@angular-devkit/schematics';

import { readRequiredFile } from './tree';

/**
 * Creates a workspace host.
 * Taken from: https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
 */
function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    /* istanbul ignore next */
    async readFile(path: string): Promise<string> {
      return await Promise.resolve(readRequiredFile(tree, path));
    },
    /* istanbul ignore next */
    async writeFile(path: string, data: string): Promise<void> {
      return await Promise.resolve(tree.overwrite(path, data));
    },
    async isDirectory(path: string): Promise<boolean> {
      // approximate a directory check
      return await Promise.resolve(
        !tree.exists(path) && tree.getDir(path).subfiles.length > 0,
      );
    },
    async isFile(path: string): Promise<boolean> {
      return await Promise.resolve(tree.exists(path));
    },
  };
}

/**
 * Returns the workspace host and project config (angular.json).
 */
export async function getWorkspace(tree: Tree): Promise<{
  host: workspaces.WorkspaceHost;
  workspace: workspaces.WorkspaceDefinition;
}> {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace('/', host);
  return { host, workspace };
}

export function getProject(
  workspace: workspaces.WorkspaceDefinition,
  projectName: string,
): { project: workspaces.ProjectDefinition; projectName: string } {
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new SchematicsException(
      `The "${projectName}" project is not defined in angular.json. Provide a valid project name.`,
    );
  }

  return { project, projectName };
}

/**
 * Allows updates to the Angular project config (angular.json).
 */
export function updateWorkspace(
  updater: (workspace: workspaces.WorkspaceDefinition) => void | Promise<void>,
): Rule {
  return async (tree) => {
    const { host, workspace } = await getWorkspace(tree);

    // Send the workspace to the callback to allow it to be modified.
    await updater(workspace);

    // Update the workspace config with any changes.
    await workspaces.writeWorkspace(workspace, host);
  };
}

/**
 * Returns the project definition corresponding to the provided name, or throws an
 * error if the project is not found.
 */
export async function getRequiredProject(
  tree: Tree,
  projectName: string | undefined,
): Promise<{ projectName: string; project: workspaces.ProjectDefinition }> {
  if (!projectName) {
    throw new Error('A project name is required.');
  }

  const { workspace } = await getWorkspace(tree);
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new Error(
      `The project '${projectName}' was not found in the workspace configuration.`,
    );
  }

  return { projectName, project };
}
