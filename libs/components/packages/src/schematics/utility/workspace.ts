import { workspaces } from '@angular-devkit/core';
import { SchematicsException, Tree } from '@angular-devkit/schematics';

import { readRequiredFile } from './tree';

/**
 * Creates a workspace host.
 * Taken from: https://angular.io/guide/schematics-for-libraries#get-the-project-configuration
 */
function createHost(tree: Tree): workspaces.WorkspaceHost {
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
  host: workspaces.WorkspaceHost;
  workspace: workspaces.WorkspaceDefinition;
}> {
  const host = createHost(tree);
  const { workspace } = await workspaces.readWorkspace('/', host);
  return { host, workspace };
}

export async function getProject(
  workspace: workspaces.WorkspaceDefinition,
  projectName: string
): Promise<{ project: workspaces.ProjectDefinition; projectName: string }> {
  const project = workspace.projects.get(projectName);
  if (!project) {
    throw new SchematicsException(
      `The "${projectName}" project is not defined in angular.json. Provide a valid project name.`
    );
  }

  return { project, projectName };
}
