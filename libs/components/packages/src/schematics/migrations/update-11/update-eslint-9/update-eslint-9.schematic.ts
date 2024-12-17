import { Rule } from '@angular-devkit/schematics';

import { updateInstalledPackage } from '../../../rules/update-package';

const ESLINT_PACKAGE = 'eslint';
const ESLINT_VERSION_TARGET = '9.17.0';
const ESLINT_VERSION_REQUIRED_RANGE = '^9.0.0 <9.17.0';

/**
 * Updates ESLint 9 to the target version to address a vulnerability.
 */
export default function updateEslint9(): Rule {
  return () => {
    return updateInstalledPackage(
      ESLINT_PACKAGE,
      ESLINT_VERSION_TARGET,
      ESLINT_VERSION_REQUIRED_RANGE,
    );
  };
}
