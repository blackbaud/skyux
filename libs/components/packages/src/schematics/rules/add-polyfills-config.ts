import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

// List of approved builders the polyfill can be added to.
const APPROVED_BUILDERS = [
  '@angular/build:application',
  '@angular/build:karma',
  '@angular-devkit/build-angular:application',
  '@angular-devkit/build-angular:browser',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:browser',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

const SKYUX_POLYFILLS = '@skyux/packages/polyfills';

/**
 * Normalizes polyfills configuration to always be an array.
 */
function normalizePolyfills(polyfills: unknown): string[] {
  if (!polyfills) {
    return [];
  }

  if (typeof polyfills === 'string') {
    return [polyfills];
  }

  if (Array.isArray(polyfills)) {
    return polyfills;
  }

  return [];
}

/**
 * Adds '@skyux/packages/polyfills' to the given targets' configuration.
 */
export function addPolyfillsConfig(
  projectName: string,
  targetNames: string[],
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
          continue;
        }

        if (!APPROVED_BUILDERS.includes(target.builder)) {
          context.logger.warn(
            `Could not add polyfills to '${projectName}:${targetName}' - unsupported builder '${target.builder}'. Supported builders: ${APPROVED_BUILDERS.join(', ')}`,
          );
          continue;
        }

        const polyfills = normalizePolyfills(target.options?.['polyfills']);

        if (!polyfills.includes(SKYUX_POLYFILLS)) {
          polyfills.push(SKYUX_POLYFILLS);
        }

        target.options = {
          ...(target.options || {}),
          polyfills,
        };
      }
    });
}
