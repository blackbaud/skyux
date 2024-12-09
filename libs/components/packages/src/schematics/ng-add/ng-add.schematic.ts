import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'fs-extra';
import path from 'path';

import { addCommonJsConfig } from '../rules/add-commonjs-config';
import { addPolyfillsConfig } from '../rules/add-polyfills-config';
import { applySkyuxStylesheetsToWorkspace } from '../rules/apply-skyux-stylesheets-to-workspace';
import { installAngularCdk } from '../rules/install-angular-cdk';
import { modifyTsConfig } from '../rules/modify-tsconfig';
import { workspaceCheck } from '../rules/workspace-check/workspace-check';
import { getRequiredProject } from '../utility/workspace';

import { Schema } from './schema';

function installEssentialSkyUxPackages(skyuxVersion: string): Rule {
  return (tree) => {
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

export default function ngAdd(options: Schema): Rule {
  return async (tree, context) => {
    const { projectName } = await getRequiredProject(tree, options.project);

    // Get the currently installed version of SKY UX.
    const { version: skyuxVersion } = fs.readJsonSync(
      path.resolve(__dirname, '../../../package.json'),
    );

    context.addTask(new NodePackageInstallTask());

    return chain([
      installEssentialSkyUxPackages(skyuxVersion),
      installAngularCdk(),
      addCommonJsConfig(projectName),
      addPolyfillsConfig(projectName, ['build', 'test']),
      applySkyuxStylesheetsToWorkspace(projectName),
      modifyTsConfig(),
      workspaceCheck(),
    ]);
  };
}
