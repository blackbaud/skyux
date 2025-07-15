import { Rule } from '@angular-devkit/schematics';

import { ensureSkyuxStylesheets } from '../utility/theme';
import { updateWorkspace } from '../utility/workspace';

export function applySkyuxStylesheetsToWorkspace(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName);

    /* istanbul ignore next */
    if (!project) {
      return;
    }

    for (const targetName of ['build', 'test']) {
      // Ignore build target for libraries.
      if (
        targetName === 'build' &&
        project.extensions['projectType'] === 'library'
      ) {
        continue;
      }

      // Add SKY UX stylesheets array to target.
      const target = project.targets.get(targetName);

      /*istanbul ignore else*/
      if (target) {
        target.options ??= {};
        target.options['styles'] = ensureSkyuxStylesheets(
          target.options['styles'] as string[] | undefined,
        );
      }
    }
  });
}
