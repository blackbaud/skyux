import { Rule, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { getEslintConfigFile } from '../utility/get-eslint-config-file';
import { getWorkspace } from '../utility/workspace';

import { addFormatNpmScript } from './rules/add-format-npm-script';
import { addPrettierDependencies } from './rules/add-prettier-dependencies';
import { configureESLint } from './rules/configure-eslint';
import { configureVSCode } from './rules/configure-vscode';
import { writePrettierConfig } from './rules/write-prettier-config';
import { writePrettierIgnore } from './rules/write-prettier-ignore';
import { SkyPrettierAddOptions } from './schema';

export default function ngAdd(options: SkyPrettierAddOptions): Rule {
  return async (tree) => {
    const { workspace } = await getWorkspace(tree);
    const { eslintConfigFile, isEsm, isFlatConfig } = getEslintConfigFile(tree);
    const importSorting = !!options.importSorting;

    return chain([
      configureESLint({ eslintConfigFile, isEsm, isFlatConfig, workspace }),
      addPrettierDependencies({
        importSorting,
      }),
      writePrettierConfig({
        importSorting,
      }),
      writePrettierIgnore(),
      configureVSCode(),
      addFormatNpmScript(),
      (_tree, context): void => {
        context.addTask(new NodePackageInstallTask());
      },
    ]);
  };
}
