import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { getWorkspace } from '../utility/workspace';

import { addDependencies } from './rules/add-dependencies';
import { configureESLint } from './rules/configure-eslint';

export default function ngAdd(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    return chain([
      configureESLint(workspace),
      addDependencies(),
      (_tree, context) => {
        context.addTask(new NodePackageInstallTask());
      },
    ]);
  };
}
