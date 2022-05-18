import { Rule } from '@angular-devkit/schematics';

import { ensureSkyuxStylesheets } from '../utility/theme';
import { updateWorkspace } from '../utility/workspace';

export function applySkyuxStylesheetsToWorkspace(): Rule {
  return () =>
    updateWorkspace((workspace) => {
      for (const project of workspace.projects.values()) {
        for (const targetName of ['build', 'test']) {
          // Ignore build target for libraries.
          if (
            targetName === 'build' &&
            project.extensions.projectType === 'library'
          ) {
            continue;
          }

          // Add SKY UX stylesheets array to target.
          const target = project.targets.get(targetName);

          /*istanbul ignore else*/
          if (target) {
            target.options.styles = ensureSkyuxStylesheets(
              target.options.styles as string[]
            );
          }
        }
      }
    });
}
