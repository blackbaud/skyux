import { Rule } from '@angular-devkit/schematics';

import { workspaceCheck } from '../../../rules/workspace-check/workspace-check';

export default function (): Rule {
  return workspaceCheck();
}
