import { Rule } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const NEEDLE_REGEX = /\.queryHarness\(/g;

export default function renameHarnessQueryMethods(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      let root = project.sourceRoot;
      root ||= project.root;

      visitProjectFiles(tree, root, (filePath) => {
        if (filePath.endsWith('.harness.ts') || filePath.endsWith('.spec.ts')) {
          const contents = tree.readText(filePath);

          if (NEEDLE_REGEX.test(contents)) {
            const modified = contents.replace(
              NEEDLE_REGEX,
              '.queryHarnessOrNull(',
            );

            tree.overwrite(filePath, modified);
          }
        }
      });
    });
  };
}
