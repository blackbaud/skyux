import { Rule, chain, externalSchematic } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { readRequiredFile } from '../../../utility/tree';
import { visitProjectFiles } from '../../../utility/visit-project-files';

const RESOURCES_MODULE_SUFFIX = '-resources.module.ts';

export default function (): Rule {
  return async (tree) => {
    const workspace = await getWorkspace(tree);

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

        const srcRoot =
          projectDefinition.sourceRoot ?? `${projectDefinition.root}/src`;

        const srcRootRegex = new RegExp(`^/${srcRoot}/`);

        visitProjectFiles(tree, srcRoot, (filePath) => {
          if (filePath.endsWith(RESOURCES_MODULE_SUFFIX)) {
            const content = readRequiredFile(tree, filePath);

            if (content.includes('SKY_LIB_RESOURCES_PROVIDERS')) {
              rules.push(
                externalSchematic('@skyux/i18n', 'lib-resources-module', {
                  project: projectName,
                  name: filePath
                    .replace(srcRootRegex, '')
                    .replace(/-resources\.module\.ts$/, ''),
                }),
              );
            }
          }
        });
      }
    }

    return chain(rules);
  };
}
