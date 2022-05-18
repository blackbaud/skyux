import { Rule } from '@angular-devkit/schematics';

import { applySkyuxStylesheetsToWorkspace } from '../../rules/apply-skyux-stylesheets-to-workspace';

export default function ensureSkyuxThemeStylesheets(): Rule {
  return applySkyuxStylesheetsToWorkspace();
}
