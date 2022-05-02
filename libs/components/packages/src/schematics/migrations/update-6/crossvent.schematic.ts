import { Rule } from '@angular-devkit/schematics';

import { addCrossventFix } from '../../rules/add-crossvent-fix';
import { getWorkspace } from '../../utility/workspace';

export default function crossventFix(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    return addCrossventFix(workspace);
  };
}
