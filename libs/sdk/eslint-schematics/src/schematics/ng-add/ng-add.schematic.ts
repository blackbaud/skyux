import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
  getPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'node:fs';
import path from 'node:path';

function getAngularVersion(): number {
  // Use require for compatibility with Jest/CommonJS
  const { version } = require('@angular/cli/package.json');
  return version.split('.')[0];
}

const ANGULAR_MAJOR_VERSION = getAngularVersion();

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

/**
 * Installs and sets up the `eslint-config-skyux` package.
 */
export default function ngAdd(): Rule {
  return (tree) => {
    if (!getPackageJsonDependency(tree, 'angular-eslint')) {
      throw new Error(
        "The package 'angular-eslint' is not installed. " +
          `Run 'ng add angular-eslint@${ANGULAR_MAJOR_VERSION}' and try this command again.\n` +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start',
      );
    }

    return chain([installDependencies()]);
  };
}
