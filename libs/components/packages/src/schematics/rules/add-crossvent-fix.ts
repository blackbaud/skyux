import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../utility/tree';

const CROSSVENT_FIX = '(window as any).global = window;';

export function addCrossventFix(workspace: WorkspaceDefinition): Rule {
  return (tree, context) => {
    for (const project of workspace.projects.values()) {
      const testTarget = project.targets.get('test');

      /*istanbul ignore else*/
      if (testTarget) {
        if (testTarget.options.main) {
          // Get the 'test.ts' entry point file path from the 'test' target.
          const filePath = testTarget.options.main.toString();
          const contents = readRequiredFile(tree, filePath);

          if (contents.includes(CROSSVENT_FIX)) {
            context.logger.info(
              'Fix for crossvent library already applied. Skipping.'
            );
            return;
          }

          tree.overwrite(
            filePath,
            contents.replace(/(declare\sconst\srequire:)/, (_, group) => {
              return `// Fix for crossvent "global is not defined" error. The crossvent library
// is used by Dragula, which in turn is used by multiple SKY UX components.
// See: https://github.com/bevacqua/dragula/issues/602
${CROSSVENT_FIX}

${group}`;
            })
          );
        }
      }
    }
  };
}
