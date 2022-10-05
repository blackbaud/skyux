import { Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';
import { getWorkspace } from '../../utility/workspace';

export default function (): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);
    for (const [, projectDefinition] of workspace.projects.entries()) {
      tree.getDir(projectDefinition.root).visit((filePath) => {
        if (filePath.match(/\.ts$/)) {
          const contents = readRequiredFile(tree, filePath);
          const hasOldImport = contents.match(
            /import\s+{(?!.*(SkyMutationObserverService))(?:\s|\w|,)+(MutationObserverService)(?:\s|\w|,)+}\s+from\s+(?:'|")@skyux\/core(?:'|")/g
          );

          if (hasOldImport) {
            const newContents = contents.replace(
              /(?:[^Sky](MutationObserverService))/g,
              (fragment, match1) => {
                return fragment.replace(match1, 'SkyMutationObserverService');
              }
            );

            if (newContents !== contents) {
              tree.overwrite(filePath, newContents);
            }
          }
        }
      });
    }
  };
}
