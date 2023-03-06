import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

/**
 * Adds '@skyux/packages/polyfills' to the given targets' configuration.
 */
export function addPolyfillsConfig(
  projectName: string,
  targetNames: string[]
): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName);

    /* istanbul ignore next */
    if (!project) {
      return;
    }

    for (const targetName of targetNames) {
      const target = project.targets.get(targetName);

      /* istanbul ignore next */
      if (!target) {
        return;
      }

      if (!target.options?.polyfills) {
        target.options = {
          ...(target.options || {}),
          polyfills: [],
        };
      } else if (typeof target.options.polyfills === 'string') {
        target.options.polyfills = [target.options.polyfills];
      }
      if (
        Array.isArray(target.options.polyfills) &&
        !target.options.polyfills.includes('@skyux/packages/polyfills')
      ) {
        target.options.polyfills.push('@skyux/packages/polyfills');
      }
    }
  });
}
