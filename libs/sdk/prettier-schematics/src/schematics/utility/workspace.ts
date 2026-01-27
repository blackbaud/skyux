import { workspaces } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';

import { readRequiredFile } from './tree';

/**
 * Creates a workspace host.
 * Taken from: https://angular.dev/tools/cli/schematics-for-libraries#get-the-project-configuration
 */
function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      return await Promise.resolve(readRequiredFile(tree, path));
    },
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
