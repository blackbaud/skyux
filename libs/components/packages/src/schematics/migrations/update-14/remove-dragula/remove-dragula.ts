import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { getDependency } from '@schematics/angular/utility/dependency';

import { removeUnusedDependencies } from '../../../rules/remove-unused-dependencies';
import { JsonFile } from '../../../utility/json-file';

const NG2_DRAGULA = 'ng2-dragula';

/**
 * Remove dragula packages if they are not being used.
 */
export default function (): Rule {
  return chain([
    removeUnusedDependencies(['dragula', NG2_DRAGULA, 'dom-autoscroller']),
    removeNg2DragulaOverrides(),
  ]);
}

/**
 * Removes ng2-dragula package overrides from package.json if ng2-dragula
 * is not present in dependencies or devDependencies.
 * This handles override keys like "ng2-dragula@version".
 */
function removeNg2DragulaOverrides(): Rule {
  return (tree: Tree) => {
    const packageJsonPath = '/package.json';

    /* v8 ignore next 3 -- @preserve */
    if (!tree.exists(packageJsonPath)) {
      return tree;
    }

    if (getDependency(tree, NG2_DRAGULA)) {
      return tree;
    }

    const jsonFile = new JsonFile(tree, packageJsonPath);
    const overrides = jsonFile.get(['overrides']) as
      | Record<string, unknown>
      | undefined;

    if (!overrides || typeof overrides !== 'object') {
      return tree;
    }

    for (const overrideKey of Object.keys(overrides)) {
      if (overrideKey.startsWith(NG2_DRAGULA)) {
        jsonFile.remove(['overrides', overrideKey]);
      }
    }

    const remainingOverrides = jsonFile.get(['overrides']) as
      | Record<string, unknown>
      | undefined;

    if (remainingOverrides && Object.keys(remainingOverrides).length === 0) {
      jsonFile.remove(['overrides']);
    }

    return tree;
  };
}
