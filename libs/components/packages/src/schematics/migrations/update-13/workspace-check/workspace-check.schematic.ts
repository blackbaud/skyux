import { Rule } from '@angular-devkit/schematics';

import { workspaceCheck } from '../../../rules/workspace-check/workspace-check.js';

export default function (): Rule {
  return workspaceCheck();
}
