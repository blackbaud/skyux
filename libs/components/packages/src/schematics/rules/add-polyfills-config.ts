import { Rule } from '@angular-devkit/schematics';

import { updateWorkspace } from '../utility/workspace';

const polyfillsBuilders = [
  '@angular-devkit/build-angular:browser',
  '@angular-devkit/build-angular:karma',
  '@blackbaud-internal/skyux-angular-builders:browser',
  '@blackbaud-internal/skyux-angular-builders:karma',
];

export function addPolyfillsConfig(): Rule {
  return updateWorkspace((workspace) => {
    workspace.projects.forEach((project) => {
      project.targets.forEach((target) => {
        if (polyfillsBuilders.includes(target.builder)) {
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
    });
  });
}
