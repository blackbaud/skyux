import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled('@skyux-sdk/testing', [
    { name: 'axe-core', version: '3.5.6', type: NodeDependencyType.Dev },
  ]);
}
