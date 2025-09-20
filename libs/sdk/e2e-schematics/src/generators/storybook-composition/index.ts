import {
  Tree,
  generateFiles,
  getProjects,
  joinPathFragments,
  logger,
  normalizePath,
} from '@nx/devkit';

import { relative } from 'path';

import { formatFiles } from '../../utils/format-files';

import { Schema } from './schema';

export default async function generateStorybookComposition(
  tree: Tree,
  schema: Schema,
): Promise<void> {
  const allProjects = getProjects(tree);
  const storybookProject = allProjects.get('storybook');
  if (!allProjects || !storybookProject) {
    (schema.ansiColor === false ? console.error : logger.error)(
      `Unable to load a project named "storybook"`,
    );
    return;
  }
  const storybookProjectRoot = storybookProject.root;
  const relativeToRoot = normalizePath(
    relative(`/${storybookProjectRoot}/.storybook`, `/`),
  );

  let projectsArg: string[] = [];
  try {
    const projectsJson = schema.projectsJson.trim();
    if (projectsJson.includes('"')) {
      projectsArg = JSON.parse(projectsJson);
    } else if (projectsJson.startsWith('[')) {
      // Powershell does not pass quotes in parameters.
      projectsArg = projectsJson
        .substring(1, projectsJson.length - 1)
        .split(',')
        .map((s) => s.trim());
    } else {
      projectsArg = projectsJson.split(',').map((s) => s.trim());
    }
  } catch {
    (schema.ansiColor === false ? console.error : logger.error)(
      `Unable to parse projectsJson: ${schema.projectsJson}`,
    );
    return;
  }
  const projects = projectsArg
    .filter((project) => project && project !== 'storybook')
    .filter((project) => {
      const projectConfiguration = allProjects.get(project);

      return (
        projectConfiguration &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        'build-storybook' in projectConfiguration.targets!
      );
    });

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    `${storybookProjectRoot}/.storybook`,
    {
      projects,
      baseUrl: schema.baseUrl.replace(/\/$/, ''),
      relativeToRoot,
    },
  );

  await formatFiles(tree, { skipFormat: schema.skipFormat });
}
