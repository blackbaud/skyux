import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

// List of approved builders the polyfill can be added to.
const polyfillsBuilders = [
  '@angular-devkit/build-angular:browser',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:browser',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

/**
 * Adds '@skyux/packages/polyfills' to the given targets' configuration.
 */
export function addPolyfillsConfig(
  projectName: string,
  targetNames: string[]
): Rule {
  return (_tree, context) =>
    updateWorkspace((workspace) => {
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

        // Abort if builder is not approved.
        if (!polyfillsBuilders.includes(target.builder)) {
          context.logger.warn(
            `Could not add polyfills to the '${projectName}' project's '${targetName}' target because it does not use an approved builder. (wanted one of ${polyfillsBuilders.join(
              ' | '
            )})`
          );
          continue;
        }

        if (!target.options?.['polyfills']) {
          target.options = {
            ...(target.options || {}),
            polyfills: [],
          };
        } else if (typeof target.options['polyfills'] === 'string') {
          target.options['polyfills'] = [target.options['polyfills']];
        }
        if (
          Array.isArray(target.options['polyfills']) &&
          !target.options['polyfills'].includes('@skyux/packages/polyfills')
        ) {
          target.options['polyfills'].push('@skyux/packages/polyfills');
        }
      }
    });
}
