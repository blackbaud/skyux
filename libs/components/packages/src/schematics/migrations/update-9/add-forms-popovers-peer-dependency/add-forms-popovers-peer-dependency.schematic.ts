import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled('@skyux/forms', [
    {
      matchVersion: true,
      name: '@skyux/popovers',
      type: NodeDependencyType.Default,
    },
  ]);
}
