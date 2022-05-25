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
  projects: string;
  baseUrl: string;
};

export default async function (tree: Tree, schema: Options) {
  const allProjects = getProjects(tree);
  const storybookProject = allProjects.get('storybook');
  const storybookProjectRoot = storybookProject.root;
  const relativeToRoot = relative(`/${storybookProjectRoot}/.storybook`, `/`);

  const projects = schema.projects
    .split(',')
    .map((project) => project.trim())
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
