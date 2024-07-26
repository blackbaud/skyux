import { Rule } from '@angular-devkit/schematics';

import { VERSION } from '../../../version';
import { updateWorkspace } from '../../utility/workspace';

import { Schema } from './schema';

const COMPAT_STYLESHEET_REGEX = /skyux(\d+)-compat\.css$/;

export default function removeCompatStylesheets(options: Schema): Rule {
  return (tree) => {
    const version = parseInt(
      options.version === 'current' ? VERSION.major : options.version,
    );
    return updateWorkspace((workspace) => {
      const compatStylesheetPaths: string[] = [];

      // Remove stylesheets from the workspace config.
      for (const project of workspace.projects.values()) {
        for (const targetName of ['build', 'test']) {
          const stylesheets = project.targets.get(targetName)?.options?.[
            'styles'
          ] as string[] | undefined;

          if (stylesheets) {
            for (let i = stylesheets.length - 1; i >= 0; i--) {
              const stylesheet = stylesheets[i];

              const check = stylesheet.match(COMPAT_STYLESHEET_REGEX);
              if (check && parseInt(check[1]) <= version) {
                compatStylesheetPaths.push(stylesheet);
                stylesheets.splice(i, 1);
              }
            }
          }
        }
      }

      // Delete stylesheet files.
      if (compatStylesheetPaths.length > 0) {
        const uniqueStylesheets = Array(...new Set(compatStylesheetPaths));
        for (const stylesheetPath of uniqueStylesheets) {
          if (tree.exists(stylesheetPath)) {
            tree.delete(stylesheetPath);
          }
        }
      }
    });
  };
}
