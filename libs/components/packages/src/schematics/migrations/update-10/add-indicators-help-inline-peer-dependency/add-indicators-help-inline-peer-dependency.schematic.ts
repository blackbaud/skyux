import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled('@skyux/indicators', [
    {
      matchVersion: true,
      name: '@skyux/help-inline',
      type: NodeDependencyType.Default,
    },
  ]);
}
