import { getProjects, workspaceRoot } from '@nx/devkit';

import { FsTree } from 'nx/src/generators/tree.js';

export function getComponentProjectNames(): string[] {
  const tree = new FsTree(workspaceRoot, false);
  return Array.from(getProjects(tree).entries())
    .filter(([, project]) => project.tags?.includes('component'))
    .map(([name]) => name);
}
