import { ProjectConfiguration, Tree, getProjects } from '@nx/devkit';

function filterProjects(
  tree: Tree,
  filter: (projectConfiguration: ProjectConfiguration) => boolean,
  name?: string,
): Map<string, ProjectConfiguration> {
  const projectConfigurations = getProjects(tree);
  const projects = new Map<string, ProjectConfiguration>();
  if (name) {
    const projectNames = name
      .split(',')
      .map((projectName) => projectName.trim())
      .filter(
        (projectName) => projectName && projectConfigurations.has(projectName),
      );
    projectNames.forEach((projectName) => {
      const projectConfiguration = projectConfigurations.get(projectName);
      if (projectConfiguration && filter(projectConfiguration)) {
        projects.set(projectName, projectConfiguration);
      }
    });
  } else {
    projectConfigurations.forEach((projectConfiguration, projectName) => {
      if (filter(projectConfiguration)) {
        projects.set(projectName, projectConfiguration);
      }
    });
  }
  return projects;
}

function projectHasTargetWithExecutor(
  projectConfiguration: ProjectConfiguration,
  executor: string,
): boolean {
  return (
    !!projectConfiguration.targets &&
    Object.values(projectConfiguration.targets).some(
      (target) => target.executor === executor,
    )
  );
}

export function getE2eProjects(
  tree: Tree,
  name?: string,
): Map<string, ProjectConfiguration> {
  return filterProjects(
    tree,
    (projectConfiguration) =>
      projectHasTargetWithExecutor(projectConfiguration, '@nx/cypress:cypress'),
    name,
  );
}

export function getStorybookProjects(
  tree: Tree,
  name?: string,
): Map<string, ProjectConfiguration> {
  return filterProjects(
    tree,
    (projectConfiguration) =>
      projectHasTargetWithExecutor(
        projectConfiguration,
        '@storybook/angular:build-storybook',
      ),
    name,
  );
}

export function getStorybookProject(
  tree: Tree,
  options: Partial<{ project: string }>,
): ProjectConfiguration {
  if (!options.project) {
    throw new Error(`Project name not specified`);
  }

  const projects = getProjects(tree);
  if (!projects.has(options.project)) {
    throw new Error(`Unable to find project ${options.project}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let projectConfig = projects.get(options.project)!;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (!('storybook' in projectConfig.targets!)) {
    options.project = `${options.project}-storybook`;
    if (!projects.has(options.project)) {
      throw new Error(`Unable to find project ${options.project}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    projectConfig = projects.get(options.project)!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!('storybook' in projectConfig.targets!)) {
      throw new Error(`Storybook is not configured for ${options.project}`);
    }
  }
  return projectConfig;
}

export function getProjectTypeBase(
  projectConfig: ProjectConfiguration,
): 'lib' | 'app' {
  return `${projectConfig.projectType === 'library' ? 'lib' : 'app'}`;
}
