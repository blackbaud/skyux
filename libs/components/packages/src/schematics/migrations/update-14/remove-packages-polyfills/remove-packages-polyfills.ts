import { Rule } from '@angular-devkit/schematics';
import { updateWorkspace } from '@schematics/angular/utility';

const POLYFILL = '@skyux/packages/polyfills';

/**
 * Remove `@skyux/packages/polyfills` from build and test targets
 * in the workspace configuration.
 */
export default function (): Rule {
  return updateWorkspace((workspace) => {
    for (const project of workspace.projects.values()) {
      for (const targetName of ['build', 'test']) {
        const polyfills = project.targets.get(targetName)?.options?.[
          'polyfills'
        ] as string[] | undefined;

        if (polyfills) {
          const index = polyfills.indexOf(POLYFILL);

          if (index > -1) {
            polyfills.splice(index, 1);
          }
        }
      }
    }
  });
}
