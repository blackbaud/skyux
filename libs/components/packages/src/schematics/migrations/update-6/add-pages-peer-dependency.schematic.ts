import { Rule } from '@angular-devkit/schematics';
import { addDepsToPackageJson } from '@nrwl/workspace';

import fs from 'fs-extra';
import path from 'path';

export default function addPagesPeerDependency(): Rule {
  // Get the currently installed version of SKY UX.
  const { version: skyuxVersion } = fs.readJsonSync(
    path.resolve(__dirname, '../../../../package.json')
  );
  return addDepsToPackageJson({ '@skyux/modals': skyuxVersion }, {});
}
