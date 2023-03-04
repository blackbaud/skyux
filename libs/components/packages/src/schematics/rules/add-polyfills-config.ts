import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

const POLYFILLS = '@skyux/packages/polyfills';

/**
 * Adds '@skyux/packages/polyfills' to the given targets' configuration.
 */
export function addPolyfillsConfig(
  projectName: string,
  targets: string[]
): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName);

    /* istanbul ignore next */
    if (!project) {
      return;
    }

    for (const targetName of targets) {
      const target = project.targets.get(targetName);

      if (!target) {
        return;
      }

      target.options ||= {};
      target.options.polyfills ||= [];

      if (typeof target.options.polyfills === 'string') {
        target.options.polyfills = [target.options.polyfills];
      }

      if (
        Array.isArray(target.options.polyfills) &&
        !target.options.polyfills.includes(POLYFILLS)
      ) {
        target.options.polyfills.push(POLYFILLS);
      }
    }
  });
}
