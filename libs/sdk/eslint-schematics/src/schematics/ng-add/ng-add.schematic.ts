import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { VERSION } from '@angular/cli';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'node:fs';
import path from 'node:path';

import { JsonFile } from '../utility/json-file';

function installDependencies(): Rule {
  return (tree, context) => {
    // Get the currently installed version of SKY UX.
    const { version: skyuxVersion } = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../../package.json'), {
        encoding: 'utf-8',
      }),
    );

    const dependencies: Record<string, string> = {
      'skyux-eslint': skyuxVersion,
    };

    for (const [packageName, version] of Object.entries(dependencies)) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: packageName,
        version: `^${version}`,
        overwrite: true,
      });
    }

    context.addTask(new NodePackageInstallTask());
  };
}

function modifyTsConfig(): Rule {
  return (tree) => {
    const tsconfig = new JsonFile(tree, '/tsconfig.json');

    // Strict null checks are needed for the '@typescript/eslint:prefer-nullish-coalescing' rule.
    // The `strict` option also sets `strictNullChecks` so we can abort if it's set to true.
    if (tsconfig.get(['compilerOptions', 'strict']) !== true) {
      tsconfig.modify(['compilerOptions', 'strictNullChecks'], true);
    }
  };
}

/**
 * Installs and sets up the `eslint-config-skyux` package.
 */
export default function ngAdd(): Rule {
  return (tree) => {
    if (!getPackageJsonDependency(tree, 'angular-eslint')) {
      throw new Error(
        "The package 'angular-eslint' is not installed. " +
          `Run 'ng add angular-eslint@${VERSION.major}' and try this command again.\n` +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start',
      );
    }

    return chain([installDependencies(), modifyTsConfig()]);
  };
}
