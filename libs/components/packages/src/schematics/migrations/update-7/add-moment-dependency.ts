import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { readRequiredFile } from '../../utility/tree';

export default function (): Rule {
  return async (tree, context) => {
    const packageJson: {
      dependencies?: { [_: string]: string };
      devDependencies?: { [_: string]: string };
    } = JSON.parse(readRequiredFile(tree, '/package.json'));

    if (
      !packageJson.dependencies?.moment &&
      !packageJson.devDependencies?.moment
    ) {
      context.addTask(new NodePackageInstallTask());

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: 'moment',
        version: '2.29.4',
        overwrite: false,
      });
    }
    // const { workspace } = await getWorkspace(tree);

    // for (const [, projectDefinition] of workspace.projects.entries()) {
    //   try {
    //     const packageJson = tree.readJson(
    //       normalize(`${projectDefinition.root}/package.json`)
    //     );
    //     packageJson
    //   } catch (err) {
    //     /* */
    //   }
    // }
  };
}
