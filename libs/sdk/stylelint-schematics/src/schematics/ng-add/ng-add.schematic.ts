import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependencyType,
  addPackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

import fs from 'node:fs';
import path from 'node:path';

import { JsonFile } from '../utility/json-file';

function installDependencies(): Rule {
  return (tree, context) => {
    const thisPackageJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../../package.json'), {
        encoding: 'utf-8',
      }),
    );

    const { version: skyuxVersion } = thisPackageJson;
    const packageGroup = thisPackageJson['ng-update']['packageGroup'];

    const dependencies: Record<string, string> = {
      'stylelint-config-skyux': skyuxVersion,
      'skyux-stylelint': skyuxVersion,
      stylelint: packageGroup['stylelint'],
      'stylelint-config-recommended-scss':
        packageGroup['stylelint-config-recommended-scss'],
    };

    for (const [packageName, version] of Object.entries(dependencies)) {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: packageName,
        version,
        overwrite: true,
      });
    }

    context.addTask(new NodePackageInstallTask());
  };
}

function configureVSCode(): Rule {
  return (tree) => {
    const vsCodePath = '.vscode';
    const extensionsPath = '.vscode/extensions.json';
    const settingsPath = '.vscode/settings.json';
    const prettierExtensionName = 'stylelint.vscode-stylelint';

    if (tree.getDir(vsCodePath).subfiles.length > 0) {
      if (!tree.exists(extensionsPath)) {
        tree.create(extensionsPath, '{}');
      }

      /* v8 ignore else -- @preserve */
      if (!tree.exists(settingsPath)) {
        tree.create(settingsPath, '{}');
      }

      const extensions = new JsonFile(tree, extensionsPath);
      const recommendations = (extensions.get(['recommendations']) ??
        []) as string[];

      if (!recommendations.includes(prettierExtensionName)) {
        recommendations.push(prettierExtensionName);
      }

      extensions.modify(['recommendations'], recommendations);

      const settings = new JsonFile(tree, settingsPath);
      settings.modify(['stylelint.validate'], ['css', 'scss']);
    }
  };
}

/**
 * Installs and sets up the `stylelint-config-skyux` package.
 */
export default function ngAdd(): Rule {
  return () => {
    return chain([installDependencies(), configureVSCode()]);
  };
}
