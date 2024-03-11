import { Rule } from '@angular-devkit/schematics';

import { visitProjectFiles } from '../../../utility/visit-project-files';
import { getWorkspace } from '../../../utility/workspace';

const OLD_METHOD_NAME_REGEX =
  /(?:[Cc]onfirm[Ii]nstance(?:\(\))?)+\.(?<methodName>closed\.(?:emit|next))\(/g;

export default function renameConfirmInstanceClosedMethod(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    workspace.projects.forEach((project) => {
      let root = project.sourceRoot;
      root ||= project.root;

      visitProjectFiles(tree, root, (filePath) => {
        if (filePath.endsWith('.spec.ts')) {
          const contents = tree.readText(filePath);

          if (OLD_METHOD_NAME_REGEX.test(contents)) {
            const modified = contents.replace(
              OLD_METHOD_NAME_REGEX,
              (matched, methodName) => matched.replace(methodName, 'close'),
            );

            tree.overwrite(filePath, modified);
          }
        }
      });
    });
  };
}
