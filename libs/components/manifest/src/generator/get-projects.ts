export interface ProjectDefinition {
  entryPoints: string[];
  packageName: string;
  projectName: string;
  projectRoot: string;
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function getProjects(
  projectsRootDirectory: string,
  projectNames: string[],
): ProjectDefinition[] {
  projectsRootDirectory = ensureTrailingSlash(projectsRootDirectory);

  const projects: ProjectDefinition[] = [];

  for (const projectName of projectNames) {
    const projectRoot = `${projectsRootDirectory}${projectName}`;

    projects.push({
      entryPoints: [
        `${projectRoot}/src/index.ts`,
        `${projectRoot}/testing/src/public-api.ts`,
      ],
      packageName: `@skyux/${projectName}`,
      projectName,
      projectRoot,
    });
  }

  return projects;
}
