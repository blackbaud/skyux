import { Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'fs-extra';
import path from 'path';

import { JsonFile } from '../../utility/json-file';

export default function addPagesModalsPeerDependency(): Rule {
  return async (tree, context) => {
    const packageJson = new JsonFile(tree, 'package.json');
    const dependencies = packageJson.get(['dependencies']) || {};
    if ('@skyux/modals' in dependencies) {
      return;
    }
    const devDependencies = packageJson.get(['devDependencies']) || {};
    if ('@skyux/modals' in devDependencies) {
      return;
    }
    // Get the currently installed version of SKY UX.
    const { version: skyuxVersion } = fs.readJsonSync(
      path.resolve(__dirname, '../../../../package.json')
    );
    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@skyux/modals',
      version: `^${skyuxVersion}`,
      overwrite: true,
    });
    context.addTask(new NodePackageInstallTask());
  };
}
