import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'fs-extra';
import path from 'path';

import { addPolyfillsConfig } from '../rules/add-polyfills-config';
import { applySkyuxStylesheetsToWorkspace } from '../rules/apply-skyux-stylesheets-to-workspace';
import { installAngularCdk } from '../rules/install-angular-cdk';
import { modifyTsConfig } from '../rules/modify-tsconfig';
import { getRequiredProject, getWorkspace } from '../utility/workspace';

import { Schema } from './schema';

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

export default function ngAdd(options: Schema): Rule {
  return async (tree, context) => {
    // Get the currently installed version of SKY UX.
    const { version: skyuxVersion } = fs.readJsonSync(
      path.resolve(__dirname, '../../../package.json')
    );

    const rules: Rule[] = [
      installEssentialSkyUxPackages(skyuxVersion),
      installAngularCdk(),
      modifyTsConfig(),
    ];

    // Add to one project.
    if (options.project) {
      const projectName = (await getRequiredProject(tree, options.project))
        .projectName;

      rules.push(
        addPolyfillsConfig(projectName, ['build', 'test']),
        applySkyuxStylesheetsToWorkspace(projectName)
      );
    } else {
      // Add to all projects.
      const { workspace } = await getWorkspace(tree);

      const projectNames = workspace.projects.keys();
      let projectName: string;

      while ((projectName = projectNames.next().value)) {
        rules.push(
          addPolyfillsConfig(projectName, ['build', 'test']),
          applySkyuxStylesheetsToWorkspace(projectName)
        );
      }
    }

    context.addTask(new NodePackageInstallTask());

    return chain(rules);
  };
}
