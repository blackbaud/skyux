import { Rule } from '@angular-devkit/schematics';

import { installAngularCdk } from '../../rules/install-angular-cdk';

export default function (): Rule {
  return installAngularCdk();
}
