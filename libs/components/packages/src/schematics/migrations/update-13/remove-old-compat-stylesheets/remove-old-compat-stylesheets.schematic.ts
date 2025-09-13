import { Rule } from '@angular-devkit/schematics';
import { externalSchematic } from '@angular-devkit/schematics/src/rules/schematic';

import { VERSION } from '../../../../version.js';

export default function updateTo13RemoveOldCompatStylesheets(): Rule {
  return externalSchematic('@skyux/packages', 'remove-compat-stylesheets', {
    belowVersion: parseInt(VERSION.major) - 1,
  });
}
