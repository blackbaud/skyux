import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import updateDependency from '../../../rules/update-dependency/update-dependency';

const AXE_CORE_PACKAGE = 'axe-core';
const AXE_CORE_VERSION = '~4.11.1';

/**
 * Sets axe-core to ~4.11.1. We can't put this in the ng-update.packageGroup
 * because we only want to update a customer's axe-core version if they've
 * installed @skyux-sdk/testing.
 */
export default function updateAxeCore(): Rule {
  return updateDependency({
    ifThisPackageIsInstalled: '@skyux-sdk/testing',
    installThese: {
      [AXE_CORE_PACKAGE]: AXE_CORE_VERSION,
    },
    type: NodeDependencyType.Dev,
  });
}
