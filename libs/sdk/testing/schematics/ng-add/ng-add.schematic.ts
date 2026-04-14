import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'node:fs';
import path from 'node:path';

function installDependencies(): Rule {
  return (tree, context) => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../package.json'), {
        encoding: 'utf-8',
      }),
    );

    const axeCoreVersion = packageJson.peerDependencies['axe-core'];

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Dev,
      name: 'axe-core',
      version: axeCoreVersion,
      overwrite: true,
    });

    context.addTask(new NodePackageInstallTask());
  };
}

export default function ngAdd(): Rule {
  return chain([installDependencies()]);
}
