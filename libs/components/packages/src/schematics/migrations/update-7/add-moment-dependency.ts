import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled('@skyux/datetime', [
    { name: 'moment', version: '2.29.4', type: NodeDependencyType.Default },
  ]);
}
