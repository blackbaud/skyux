import { Rule } from '@angular-devkit/schematics';
import { updateWorkspace } from '@schematics/angular/utility';

// List of builders that support styles.
const allowedBuilders = [
  '@angular/build:application',
  '@angular/build:karma',
  '@angular-devkit/build-angular:application',
  '@angular-devkit/build-angular:browser',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:browser',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

/**
 * Adds stylesheets to the given targets' configuration.
 */
export function addAgGridStylesConfig(projectName: string): Rule {
  const targetNames = ['build', 'test'];
  return () =>
    updateWorkspace((workspace) => {
      const project = workspace.projects.get(projectName);
      if (!project) {
        console.log(`Could not find project: ${projectName}`);
        return;
      }

      for (const targetName of targetNames) {
        const target = project.targets.get(targetName);
        if (!target || !allowedBuilders.includes(target.builder)) {
          continue;
        }

        target.options ??= {};
        target.options['styles'] ??= [];
        target.options['styles'] = [
          ...new Set([
            ...(target.options['styles'] as string[]),
            '@skyux/ag-grid/css/sky-ag-grid.css',
          ]),
        ].sort((a, b) => a.localeCompare(b));
      }
    });
}
