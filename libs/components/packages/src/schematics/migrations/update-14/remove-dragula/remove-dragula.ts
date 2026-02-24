import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { getDependency } from '@schematics/angular/utility/dependency';

import { removeUnusedDependencies } from '../../../rules/remove-unused-dependencies';
import { JsonFile } from '../../../utility/json-file';

interface PackageJson {
  overrides?: Record<string, unknown>;
  [key: string]: unknown;
}

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

    // Don't remove overrides if the package is still in use
    if (getDependency(tree, NG2_DRAGULA)) {
      return tree;
    }

    const jsonFile = new JsonFile(tree, packageJsonPath);
    const packageJson = jsonFile.get([]) as PackageJson;

    if (!packageJson.overrides || typeof packageJson.overrides !== 'object') {
      return tree;
    }

    let hasChanges = false;
    const overrideKeys = Object.keys(packageJson.overrides);

    for (const overrideKey of overrideKeys) {
      if (overrideKey.startsWith(NG2_DRAGULA)) {
        delete packageJson.overrides[overrideKey];
        hasChanges = true;
      }
    }

    // If overrides is now empty, remove the entire overrides section
    if (Object.keys(packageJson.overrides).length === 0) {
      delete packageJson.overrides;
    }

    if (hasChanges) {
      tree.overwrite(
        packageJsonPath,
        JSON.stringify(packageJson, null, '\t') + '\n',
      );
    }

    return tree;
  };
}
