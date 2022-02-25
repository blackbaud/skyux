import { chain, Rule } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { getWorkspace } from '../utility/workspace';

import { addFormatNpmScript } from './rules/add-format-npm-script';
import { addPrettierDependencies } from './rules/add-prettier-dependencies';
import { configureESLint } from './rules/configure-eslint';
import { configureVSCode } from './rules/configure-vscode';
import { writePrettierConfig } from './rules/write-prettier-config';
import { writePrettierIgnore } from './rules/write-prettier-ignore';

export default function ngAdd(): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);

    return chain([
      configureESLint(workspace),
      addPrettierDependencies(),
      writePrettierConfig(),
      writePrettierIgnore(),
      configureVSCode(),
      addFormatNpmScript(),
      (_tree, context) => {
        context.addTask(new NodePackageInstallTask());
      },
    ]);
  };
}
