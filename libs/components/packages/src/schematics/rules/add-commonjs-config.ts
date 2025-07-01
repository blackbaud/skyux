import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

// List of builders that support allowedCommonJsDependencies.
const allowedCommonJsDependenciesBuilders = [
  '@angular/build:application',
  '@angular-devkit/build-angular:application',
  '@angular-devkit/build-angular:browser',
  '@blackbaud-internal/skyux-angular-builders:browser',
];

/**
 * Adds allowedCommonJsDependencies to the given targets' configuration.
 */
export function addCommonJsConfig(projectName: string): Rule {
  const targetNames = ['build'];
  return () =>
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
        if (!allowedCommonJsDependenciesBuilders.includes(target.builder)) {
          continue;
        }

        target.options ??= {};
        target.options['allowedCommonJsDependencies'] ??= [];
        target.options['allowedCommonJsDependencies'] = [
          ...new Set([
            ...(target.options['allowedCommonJsDependencies'] as string[]),
            '@skyux/icons',
            'autonumeric',
            'dom-autoscroller',
            'dragula',
            'fontfaceobserver',
            'intl-tel-input',
            'moment',
          ]),
        ].sort((a, b) => a.localeCompare(b));
      }
    });
}
