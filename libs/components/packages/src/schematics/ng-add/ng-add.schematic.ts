import { Rule, chain, schematic } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { VERSION as SKYUX_VERSION } from '../../version';
import { workspaceCheck } from '../rules/workspace-check/workspace-check';
import { getAngularMajorVersion } from '../utility/get-angular-major-version';

export default function ngAdd(): Rule {
  return (_, context) => {
    context.addTask(new NodePackageInstallTask());

    const rules = [
      workspaceCheck(),
      addDependencies(),
      configureWorkspaceIfSingleProject(),
    ];

    return chain(rules);
  };
}

function configureWorkspaceIfSingleProject(): Rule {
  return async (tree, context) => {
    const workspace = await getWorkspace(tree);

    if (workspace.projects.size === 1) {
      const project = workspace.projects.keys().next().value;

      return schematic('add-skyux-to-project', { project });
    } else {
      context.logger.info(
        'Multiple projects detected in workspace. To configure SKY UX for a specific project, run: ng generate @skyux/packages:add-skyux-to-project --project <project-name>',
      );
    }

    return tree;
  };
}

function addDependencies(): Rule {
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
        version: `^${SKYUX_VERSION.full}`,
        overwrite: true,
      });
    }

    const angularVersion = getAngularMajorVersion();

    addPackageJsonDependency(tree, {
      type: NodeDependencyType.Default,
      name: '@angular/cdk',
      version: `^${angularVersion}.0.0`,
      overwrite: true,
    });
  };
}
