import { normalize } from '@angular-devkit/core';
import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'fs-extra';

import { addCrossventFix } from '../rules/add-crossvent-fix';
import { applySkyuxStylesheetsToWorkspace } from '../rules/apply-skyux-stylesheets-to-workspace';
import { installAngularCdk } from '../rules/install-angular-cdk';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return async (tree) => {
    const packageNames = [
      '@skyux/assets',
      '@skyux/core',
      '@skyux/i18n',
      '@skyux/theme',
    ];

    for (const packageName of packageNames) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: packageName,
        version: `^${skyuxVersion}`,
        overwrite: true,
      });
    }
  };
}

export default function ngAdd(): Rule {
  return async (tree, context) => {
    // Get the currently installed version of SKY UX.
    const { version: skyuxVersion } = fs.readJsonSync(
      normalize(`${__dirname}/../../../package.json`)
    );

    context.addTask(new NodePackageInstallTask());

    return chain([
      installEssentialSkyUxPackages(skyuxVersion),
      installAngularCdk(),
      addCrossventFix(),
      applySkyuxStylesheetsToWorkspace(),
    ]);
  };
}
