import fs from 'node:fs';
import path from 'node:path';

export interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function getProjectDefinitions(
  projectsRootDirectory: string,
  projectNames: string[],
): ProjectDefinition[] {
  projectsRootDirectory = ensureTrailingSlash(projectsRootDirectory);

  const projects: ProjectDefinition[] = [];

  for (const projectName of projectNames) {
    const projectRoot = `${projectsRootDirectory}${projectName}`;

    const entryPoints = [`${projectRoot}/src/index.ts`];
    const testingEntryPoint = `${projectRoot}/testing/src/public-api.ts`;

    if (fs.existsSync(path.normalize(testingEntryPoint))) {
      entryPoints.push(testingEntryPoint);
    }

    projects.push({
      entryPoints,
      packageName: `@skyux/${projectName}`,
      projectName,
      projectRoot,
    });
  }

  return projects;
}
