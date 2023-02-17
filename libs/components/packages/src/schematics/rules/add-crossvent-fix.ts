import { Rule, chain } from '@angular-devkit/schematics';

import fs from 'fs-extra';

import { readRequiredFile } from '../utility/tree';
import { getWorkspace, updateWorkspace } from '../utility/workspace';

const CROSSVENT_FIX = '(window as any).global = window;';

export function addCrossventFix(): Rule {
  const testTs = fs.readFileSync(
    `${__dirname}/files/add-crossvent-fix/test.ts.template`,
    'utf8'
  );
  return async (tree, context): Promise<Rule> => {
    const rules: Rule[] = [];
    const { workspace } = await getWorkspace(tree);
    workspace.projects.forEach((project, projectName) => {
      const testTarget = project.targets.get('test');

      /*istanbul ignore else*/
      if (testTarget) {
        if (testTarget.options && testTarget.options.main) {
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
            contents.replace(
              /(\/\/ First, initialize the Angular testing environment\.)/,
              (_, group) => {
                return `// Fix for crossvent "global is not defined" error. The crossvent library
// is used by Dragula, which in turn is used by multiple SKY UX components.
// See: https://github.com/bevacqua/dragula/issues/602
${CROSSVENT_FIX}

${group}`;
              }
            )
          );
        } else {
          rules.push(
            (tree) => {
              tree.create(`${project.sourceRoot}/test.ts`, testTs);
            },
            updateWorkspace((workspace) => {
              const project = workspace.projects.get(projectName);
              if (project) {
                const testTarget = project.targets.get('test');
                if (testTarget) {
                  testTarget.options = {
                    ...testTarget.options,
                    main: `${project.sourceRoot}/test.ts`,
                  };
                }
              }
            })
          );
        }
      }
    });
    return chain(rules);
  };
}
