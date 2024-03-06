import { Rule } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const OLD_METHOD_NAME_REGEX = /\.queryHarness\(/g;
const NEW_METHOD_NAME = '.queryHarnessOrNull(';

export default function renameHarnessQueryMethods(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      let root = project.sourceRoot;
      root ||= project.root;

      visitProjectFiles(tree, root, (filePath) => {
        if (filePath.endsWith('.harness.ts') || filePath.endsWith('.spec.ts')) {
          const contents = tree.readText(filePath);

          if (OLD_METHOD_NAME_REGEX.test(contents)) {
            const modified = contents.replace(
              OLD_METHOD_NAME_REGEX,
              NEW_METHOD_NAME,
            );

            tree.overwrite(filePath, modified);
          }
        }
      });
    });
  };
}
