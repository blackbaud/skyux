import { ProjectConfiguration, Tree, getProjects } from '@nrwl/devkit';

function filterProjects(
  tree: Tree,
  filter: (projectConfiguration: ProjectConfiguration) => boolean,
  name?: string
): Map<string, ProjectConfiguration> {
  const projectConfigurations = getProjects(tree);
  const projects = new Map<string, ProjectConfiguration>();
  if (name) {
    const projectNames = name
      .split(',')
      .map((projectName) => projectName.trim())
      .filter(
        (projectName) => projectName && projectConfigurations.has(projectName)
      );
    projectNames.forEach((projectName) => {
      const projectConfiguration = projectConfigurations.get(projectName);
      if (filter(projectConfiguration)) {
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
  executor: string
): boolean {
  return Object.values(projectConfiguration.targets).some(
    (target) => target.executor === executor
  );
}

export function getE2eProjects(
  tree: Tree,
  name?: string
): Map<string, ProjectConfiguration> {
  return filterProjects(
    tree,
    (projectConfiguration) =>
      projectHasTargetWithExecutor(
        projectConfiguration,
        '@nrwl/cypress:cypress'
      ),
    name
  );
}

export function getStorybookProjects(
  tree: Tree,
  name?: string
): Map<string, ProjectConfiguration> {
  return filterProjects(
    tree,
    (projectConfiguration) =>
      projectHasTargetWithExecutor(
        projectConfiguration,
        '@storybook/angular:build-storybook'
      ),
    name
  );
}
