import {
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
} from '@nrwl/devkit';

import { relative } from 'path';

import { Schema } from './schema';

export default async function (tree: Tree, schema: Schema) {
  const allProjects = getProjects(tree);
  const storybookProject = allProjects.get('storybook');
  if (!allProjects || !storybookProject) {
    (schema.ansiColor === false ? console.error : logger.error)(
      `Unable to load a project named "storybook"`
    );
    return;
  }
  const storybookProjectRoot = storybookProject.root;
  const relativeToRoot = relative(`/${storybookProjectRoot}/.storybook`, `/`);

  const projectsArg: string[] = JSON.parse(schema.projectsJson);
  const projects = projectsArg
    .filter((project) => project && project !== 'storybook')
    .filter((project) => {
      const projectConfiguration = allProjects.get(project);
      return (
        projectConfiguration &&
        'build-storybook' in projectConfiguration.targets
      );
    });

  if (projects.length === 0) {
    (schema.ansiColor === false ? console.error : logger.fatal)(
      `None of these projects have a Storybook target.`
    );
    return;
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    `${storybookProjectRoot}/.storybook`,
    {
      projects,
      baseUrl: schema.baseUrl.replace(/\/$/, ''),
      relativeToRoot,
    }
  );
  return formatFiles(tree);
}
