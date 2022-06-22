import { angularStoriesGenerator } from '@nrwl/angular/generators';
import {
  ProjectConfiguration,
  Tree,
  formatFiles,
  getProjects,
  visitNotIgnoredFiles,
} from '@nrwl/devkit';

import {
  applyTransformers,
  getInsertStringPropertyTransformer,
  getRenameVariablesTransformer,
  getStringLiteral,
  getStringLiteralsSetterTransformer,
  readSourceFile,
  writeSourceFile,
} from '../../utils/ast-utils';

import { StoriesGeneratorSchema } from './schema';

interface NormalizedSchema extends StoriesGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  projectConfig: ProjectConfiguration;
}

function normalizeOptions(
  tree: Tree,
  options: StoriesGeneratorSchema
): NormalizedSchema {
  const projects = getProjects(tree);
  if (!projects.has(options.project)) {
    throw new Error(`Unable to find project ${options.project}`);
  }
  let projectConfig = projects.get(options.project);
  if (!('storybook' in projectConfig.targets)) {
    options.project = `${options.project}-storybook`;
    if (!projects.has(options.project)) {
      throw new Error(`Unable to find project ${options.project}`);
    }
    projectConfig = projects.get(options.project);
    if (!('storybook' in projectConfig.targets)) {
      throw new Error(`Storybook is not configured for ${options.project}`);
    }
  }
  const projectDirectory = projectConfig.sourceRoot;
  const projectName = options.project;
  const projectRoot = projectConfig.root;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    projectConfig,
  };
}

function titleCase(string: string) {
  return string
    .replace(/[-_]/g, ' ')
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

export async function storiesGenerator(
  tree: Tree,
  options: StoriesGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  angularStoriesGenerator(tree, {
    name: normalizedOptions.projectName,
    cypressProject: normalizedOptions.cypressProject,
    generateCypressSpecs: normalizedOptions.generateCypressSpecs,
  });
  const changes = tree.listChanges();
  visitNotIgnoredFiles(tree, normalizedOptions.projectDirectory, (filepath) => {
    if (
      filepath.endsWith('.stories.ts') &&
      changes.findIndex(
        (change) => change.path === filepath && change.type === 'CREATE'
      ) > -1
    ) {
      const source = readSourceFile(tree, filepath);
      const componentClass = getStringLiteral(source, 'title');
      const newTitle = componentClass.replace(/Component$/, '');

      const paths = filepath
        .substring(normalizedOptions.projectConfig.sourceRoot.length + 1)
        .split('/');
      const filename = paths.pop();
      let componentGroup = '';
      for (let i = paths.length - 1; i >= 0; i--) {
        if (!filename.startsWith(paths[i])) {
          componentGroup = `${titleCase(paths[i])}/`;
          break;
        }
      }

      const renameTransformer = getRenameVariablesTransformer({
        Primary: newTitle,
      });
      const setStringTransformer = getStringLiteralsSetterTransformer({
        title: `Components/${componentGroup}${newTitle}`,
      });
      const insertStringTransformer = getInsertStringPropertyTransformer(
        'title',
        'id',
        `${componentClass.toLowerCase()}--primary`
      );
      const [updated] = applyTransformers(
        [source],
        [renameTransformer, setStringTransformer, insertStringTransformer]
      );
      writeSourceFile(tree, filepath, updated);
    }
  });
  await formatFiles(tree);
}

export default storiesGenerator;
