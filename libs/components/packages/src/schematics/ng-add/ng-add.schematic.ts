import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import { VERSION } from '../../version';
import { addCommonJsConfig } from '../rules/add-commonjs-config';
import { addPolyfillsConfig } from '../rules/add-polyfills-config';
import { applySkyuxStylesheetsToWorkspace } from '../rules/apply-skyux-stylesheets-to-workspace';
import { installAngularCdk } from '../rules/install-angular-cdk';
import { workspaceCheck } from '../rules/workspace-check/workspace-check';
import { getRequiredProject } from '../utility/workspace';

import { Schema } from './schema';

export default function ngAdd(options: Schema): Rule {
  return async (tree, context) => {
    const { projectName } = await getRequiredProject(tree, options.project);

    context.addTask(new NodePackageInstallTask());

    return chain([
      workspaceCheck(),
      installEssentialSkyUxPackages(),
      installAngularCdk(),
      addCommonJsConfig(projectName),
      addPolyfillsConfig(projectName, ['build', 'test']),
      applySkyuxStylesheetsToWorkspace(projectName),
    ]);
  };
}

function installEssentialSkyUxPackages(): Rule {
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
        version: `^${VERSION.full}`,
        overwrite: true,
      });
    }
  };
}
