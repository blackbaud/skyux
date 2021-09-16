import { chain, Rule } from '@angular-devkit/schematics';

import { JsonFile } from '../../utility/json-file';
import { getProject, getWorkspace } from '../../utility/workspace';

function updateLibraryTsConfig(projectName: string): Rule {
  return (tree) => {
    const tsconfigPath = `projects/${projectName}/tsconfig.lib.json`;
    const tsConfig = new JsonFile(tree, tsconfigPath);
    const exclude = tsConfig.get(['exclude']);
    if (!exclude.includes('testing/src/test.ts')) {
      exclude.push('testing/src/test.ts');
      tsConfig.modify(['exclude'], exclude);
    }
  };
}

function updateSpecTsConfig(projectName: string): Rule {
  return (tree) => {
    const tsconfigPath = `projects/${projectName}/tsconfig.spec.json`;
    const tsConfig = new JsonFile(tree, tsconfigPath);
    const files = tsConfig.get(['files']);
    if (!files.includes('testing/src/test.ts')) {
      files.push('testing/src/test.ts');
      tsConfig.modify(['files'], files);
    }
  };
}

function createTestingEntryPoint(projectName: string): Rule {
  return (tree) => {
    const filePath = `projects/${projectName}/testing/src/test.ts`;
    if (!tree.exists(filePath)) {
      tree.create(
        filePath,
        `const context = (require as any).context('./', true, /\.spec\.ts$/);
context.keys().map(context);
`
      );
    }
  };
}

export default function updatePackages(): Rule {
  return async (tree) => {
    const { host, workspace } = await getWorkspace(tree);

    const { project, projectName } = await getProject(
      workspace,
      workspace.extensions.defaultProject as string
    );

    // Only run for libraries.
    if (project.extensions.projectType !== 'library') {
      return;
    }

    const hasTestingModule = await host.isDirectory(
      `projects/${projectName}/testing`
    );

    // Only run if a testing module exists.
    if (!hasTestingModule) {
      return;
    }

    return chain([
      updateLibraryTsConfig(projectName),
      updateSpecTsConfig(projectName),
      createTestingEntryPoint(projectName),
    ]);
  };
}
