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

export default async function (tree: Tree, schema: Options) {
  const allProjects = getProjects(tree);
  const storybookProject = allProjects.get('storybook');
  const storybookProjectRoot = storybookProject.root;
  const relativeToRoot = relative(`/${storybookProjectRoot}/.storybook`, `/`);

  let projectsArg: string[] = JSON.parse(schema.projectsJson);
  const projects = projectsArg
    .filter((project) => project && project !== 'storybook')
    .filter((project) => {
      const target = allProjects.get(project).targets['build-storybook'];
      return target && target.executor === '@storybook/angular:build-storybook';
    });

  if (projects.length === 0) {
    logger.fatal(`None of these projects have a Storybook target.`);
    return;
  }

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    'libs/components/storybook/.storybook',
    {
      projects,
      baseUrl: schema.baseUrl.replace(/\/$/, ''),
      relativeToRoot,
    }
  );
  return formatFiles(tree);
}
