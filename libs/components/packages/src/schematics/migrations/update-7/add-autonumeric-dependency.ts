import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled('@skyux/autonumeric', [
    { name: 'autonumeric', version: '4.6.0', type: NodeDependencyType.Default },
  ]);
}
