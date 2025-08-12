import { Tree } from '@angular-devkit/schematics';
import { ProjectDefinition } from '@schematics/angular/utility';
import { getWorkspace } from '@schematics/angular/utility/workspace';

/**
 * Returns the project definition corresponding to the provided name, or throws an
 * error if the project is not found.
 */
export async function getRequiredProject(
  tree: Tree,
  projectName: string | undefined,
): Promise<{ projectName: string; project: ProjectDefinition }> {
  if (!projectName) {
    throw new Error('A project name is required.');
  }

  const workspace = await getWorkspace(tree);
  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new Error(
      `The project '${projectName}' was not found in the workspace configuration.`,
    );
  }

  return { projectName, project };
}

export async function getDefaultProjectName(
  tree: Tree,
): Promise<string | undefined> {
  const { workspace } = await getWorkspace(tree);
  if (workspace.projects.size === 1) {
    return workspace.projects.keys().next().value;
  }
  return undefined;
}
