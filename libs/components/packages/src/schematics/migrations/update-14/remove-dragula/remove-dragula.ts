import { normalize } from '@angular-devkit/core';
import { Rule, Tree, chain } from '@angular-devkit/schematics';
import {
  DependencyType,
  ExistingBehavior,
  addDependency,
  removeDependency,
} from '@schematics/angular/utility/dependency';

import { getProjectsUsingPackage } from '../../../utility/dependencies';
import { JsonFile } from '../../../utility/json-file';

const NG2_DRAGULA = 'ng2-dragula';
const NG2_DRAGULA_VERSION = '5.1.0';
const DRAGULA_VERSION = '3.7.3';

/**
 * Remove dragula packages if they are not being used.
 */
export default function (): Rule {
  return async (tree) => {
    const rules: Rule[] = [removeDependency('dom-autoscroller')];
    const projects = await getProjectsUsingPackage(tree, NG2_DRAGULA);

    if (projects.length > 0) {
      rules.push(
        addDependency('@types/dragula', '2.1.36', {
          existing: ExistingBehavior.Skip,
          type: DependencyType.Dev,
        }),
        addDependency('dragula', DRAGULA_VERSION, {
          existing: ExistingBehavior.Skip,
          type: DependencyType.Default,
        }),
        addDependency(NG2_DRAGULA, NG2_DRAGULA_VERSION, {
          existing: ExistingBehavior.Skip,
          type: DependencyType.Default,
        }),
        addPackageJsonOverride(`${NG2_DRAGULA}@${NG2_DRAGULA_VERSION}`, {
          '@angular/animations': '>=21.0.0',
          '@angular/core': '>=21.0.0',
          '@angular/common': '>=21.0.0',
        }),
      );

      for (const project of projects) {
        if (project.extensions['projectType'] === 'library') {
          rules.push(
            addProjectDependency(project.root, 'dragula', DRAGULA_VERSION),
            addProjectDependency(
              project.root,
              NG2_DRAGULA,
              NG2_DRAGULA_VERSION,
            ),
          );
        }
      }
    } else {
      rules.push(
        removeDependency('@types/dragula'),
        removeDependency('dragula'),
        removeDependency(NG2_DRAGULA),
        removePackageJsonOverride(NG2_DRAGULA),
      );
    }

    return chain(rules);
  };
}

function removePackageJsonOverride(packageName: string): Rule {
  return (tree: Tree) => {
    const packageJsonPath = '/package.json';
    const packageJson = new JsonFile(tree, packageJsonPath);

    const overrides = packageJson.get(['overrides']) as
      | Record<string, unknown>
      | undefined;

    if (!overrides || typeof overrides !== 'object') {
      return tree;
    }

    for (const overrideKey of Object.keys(overrides)) {
      if (overrideKey.startsWith(packageName)) {
        packageJson.remove(['overrides', overrideKey]);
      }
    }

    const remainingOverrides = packageJson.get(['overrides']) as
      | Record<string, unknown>
      | undefined;

    if (remainingOverrides && Object.keys(remainingOverrides).length === 0) {
      packageJson.remove(['overrides']);
    }

    return tree;
  };
}

function addPackageJsonOverride(
  overrideKey: string,
  value: Record<string, string>,
): Rule {
  return (tree) => {
    const packageJsonPath = '/package.json';
    const packageJson = new JsonFile(tree, packageJsonPath);
    packageJson.modify(['overrides', overrideKey], value);
  };
}

function addProjectDependency(
  projectRoot: string,
  packageName: string,
  version: string,
): Rule {
  return (tree: Tree) => {
    const packageJsonPath = normalize(`${projectRoot}/package.json`);
    const packageJson = new JsonFile(tree, packageJsonPath);
    const existingVersion = packageJson.get(['dependencies', packageName]);

    if (!existingVersion) {
      packageJson.modify(['dependencies', packageName], version);
    }

    return tree;
  };
}
