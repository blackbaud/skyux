import { Rule, externalSchematic } from '@angular-devkit/schematics';

import { VERSION } from '../../../../version';

export default function removeOldCompatStylesheets(): Rule {
  return externalSchematic('@skyux/packages', 'remove-compat-stylesheets', {
    belowVersion: parseInt(VERSION.major) - 1,
  });
}
