import { Rule } from '@angular-devkit/schematics';
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { ensurePeersInstalled } from '../../../rules/ensure-peers-installed';

export default function (): Rule {
  return ensurePeersInstalled(
    '@skyux/angular-tree-component',
    [
      {
        name: '@blackbaud/angular-tree-component',
        version: '1.0.0-alpha.0',
        type: NodeDependencyType.Default,
      },
    ],
    [
      {
        name: '@circlon/angular-tree-component',
      },
    ]
  );
}
