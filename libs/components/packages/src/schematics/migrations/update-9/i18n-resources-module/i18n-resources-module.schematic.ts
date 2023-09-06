import { Rule, chain, externalSchematic } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../../utility/tree';
import { getWorkspace } from '../../../utility/workspace';

const RESOURCES_MODULE_SUFFIX = '-resources.module.ts';

export default function (): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    const rules: Rule[] = [];

    for (const [
      projectName,
      projectDefinition,
    ] of workspace.projects.entries()) {
      if (projectDefinition.extensions['projectType'] === 'library') {
        const packageJson = JSON.parse(readRequiredFile(tree, '/package.json'));

        const dependencies = {
          ...(packageJson.dependencies ?? {}),
          ...(packageJson.devDependencies ?? {}),
        };

        if (dependencies['@skyux/i18n'] === undefined) {
          continue;
        }

        tree.getDir(projectDefinition.root).visit((filePath) => {
          if (filePath.endsWith(RESOURCES_MODULE_SUFFIX)) {
            const content = readRequiredFile(tree, filePath);

            if (content.includes('SKY_LIB_RESOURCES_PROVIDERS')) {
              rules.push(
                externalSchematic('@skyux/i18n', 'lib-resources-module', {
                  project: projectName,
                  name: content
                    .split('ng generate @skyux/i18n:lib-resources-module ')[1]
                    .split("'")[0],
                })
              );
            }
          }
        });
      }
    }

    return chain(rules);
  };
}
