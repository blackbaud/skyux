import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import updateDependency from '../../../rules/update-dependency/update-dependency';

export default function stylelint(): Rule {
  return updateDependency({
    ifThisPackageIsInstalled: 'stylelint-config-skyux',
    installThese: {
      stylelint: '^17.1.0',
      'stylelint-config-recommended-scss': '^17.0.0',
    },
    type: NodeDependencyType.Dev,
  });
}
