import {
  Tree,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
} from '@nrwl/devkit';

import { relative } from 'path';

type Options = {
  projectsJson: string;
  baseUrl: string;
};

export async function generateStorybookComposition(
  tree: Tree,
  schema: Options
) {
  const allProjects = getProjects(tree);
  const storybookProject = allProjects.get('storybook');
  if (!allProjects || !storybookProject) {
    logger.error(`Unable to load a project named "storybook"`);
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
    logger.fatal(`None of these projects have a Storybook target.`);
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

export default generateStorybookComposition;
