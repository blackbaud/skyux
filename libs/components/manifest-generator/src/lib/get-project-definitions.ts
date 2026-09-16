import fs from 'node:fs';
import path from 'node:path';

export interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
  tsConfigPath: string;
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function getProjectDefinitions(options: {
  packageScope: string;
  projectNames: string[];
  projectsRootDirectory: string;
}): ProjectDefinition[] {
  const { packageScope, projectNames } = options;
  const projectsRootDirectory = ensureTrailingSlash(
    options.projectsRootDirectory,
  );

  const projects: ProjectDefinition[] = [];

  for (const projectName of projectNames) {
    const projectRoot = `${projectsRootDirectory}${projectName}`;

    const entryPoints = [`${projectRoot}/src/index.ts`];
    const testingEntryPoint = `${projectRoot}/testing/src/public-api.ts`;

    if (fs.existsSync(path.normalize(testingEntryPoint))) {
      entryPoints.push(testingEntryPoint);
    }

    const prodTsConfigPath = `${projectRoot}/tsconfig.lib.prod.json`;

    projects.push({
      entryPoints,
      packageName: `${packageScope}/${projectName}`,
      projectName,
      projectRoot,
      tsConfigPath: fs.existsSync(path.normalize(prodTsConfigPath))
        ? prodTsConfigPath
        : `${projectRoot}/tsconfig.lib.json`,
    });
  }

  return projects;
}
