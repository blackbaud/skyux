import { Rule } from '@angular-devkit/schematics';

import { VERSION } from '../../../../version';
import { updateWorkspace } from '../../../utility/workspace';

const COMPAT_STYLESHEET_REGEX = /skyux\d+-compat\.css$/;
const CURRENT_VERSION_COMPAT_STYLESHEET = `skyux${VERSION.major}-compat.css`;

export default function removeOldCompatStylesheets(): Rule {
  return (tree) => {
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

              if (stylesheet.endsWith(CURRENT_VERSION_COMPAT_STYLESHEET)) {
                continue;
              }

              if (COMPAT_STYLESHEET_REGEX.test(stylesheet)) {
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
