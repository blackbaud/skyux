import { Rule, chain } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import {
  getProject,
  getWorkspace,
  updateWorkspace,
} from '../../utility/workspace';

function updateSpecsEntryPoint(projectName: string): Rule {
  return (tree) => {
    const filePath = `projects/${projectName}/src/test.ts`;
    let contents = readRequiredFile(tree, filePath);
    if (!contents.includes('const testingContext')) {
      contents += `
// Find any tests included in the "testing" entry point.
try {
  const testingContext = require.context('../testing/', true, /\\.spec\\.ts$/);
  testingContext.keys().map(testingContext);
} catch (err) {}
`;
      tree.overwrite(filePath, contents);
    }
  };
}

function addEntryPointToCodeCoverageIgnore(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName)!;
    const testTarget = project.targets.get('test')!;
    const options = testTarget.options!;

    options.codeCoverageExclude = (options.codeCoverageExclude ||
      []) as string[];

    const ignorePattern = `projects/${projectName}/src/test.ts`;
    if (!options.codeCoverageExclude.includes(ignorePattern)) {
      options.codeCoverageExclude.push(ignorePattern);
    }
  });
}

export default function updatePackages(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    const { project, projectName } = await getProject(
      workspace,
      workspace.extensions.defaultProject as string
    );

    // Only run for libraries.
    if (project.extensions.projectType !== 'library') {
      return;
    }

    return chain([
      updateSpecsEntryPoint(projectName),
      addEntryPointToCodeCoverageIgnore(projectName),
    ]);
  };
}
