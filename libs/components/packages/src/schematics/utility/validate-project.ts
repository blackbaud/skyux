import { ProjectDefinition } from '@angular-devkit/core/src/workspace';
import { Tree } from '@angular-devkit/schematics';

import { getWorkspace } from './workspace';

export default async function validateProject(
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
