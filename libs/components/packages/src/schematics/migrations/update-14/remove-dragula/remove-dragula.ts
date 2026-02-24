import { Rule } from '@angular-devkit/schematics';

import { removeUnusedDependencies } from '../../../rules/remove-unused-dependencies';

/**
 * Remove dragula packages if they are not being used.
 */
export default function (): Rule {
  return removeUnusedDependencies([
    'dragula',
    'ng2-dragula',
    'dom-autoscroller',
  ]);
}
