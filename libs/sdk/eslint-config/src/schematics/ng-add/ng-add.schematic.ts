import {
  Rule,
  Tree,
  chain,
  externalSchematic,
} from '@angular-devkit/schematics';

import { readJson } from 'fs-extra';
import { resolve } from 'path';

import { modifyEsLintConfig } from '../shared/rules/modify-eslint-config';
import { modifyTsConfig } from '../shared/rules/modify-tsconfig';
import { PackageJson } from '../shared/types/package-json';
import { readRequiredFile } from '../shared/utility/tree';

import { NgAddSchema } from './schema';

function getPackageJson(tree: Tree): PackageJson {
  return JSON.parse(readRequiredFile(tree, '/package.json')) as PackageJson;
}

function hardenPackageVersion(): Rule {
  return async (tree) => {
    const thisPackageJson = await readJson(
      resolve(__dirname, '../../../package.json'),
    );

    const packageJson = getPackageJson(tree);
    packageJson.devDependencies ||= {};
    packageJson.devDependencies[thisPackageJson.name] = thisPackageJson.version;

    tree.overwrite('/package.json', JSON.stringify(packageJson, undefined, 2));
  };
}

export default function ngAdd(options: NgAddSchema): Rule {
  return (tree) => {
    if (options.useRecommendedPackage) {
      return externalSchematic('eslint-config-skyux', 'ng-add', {});
    }

    const packageJson = getPackageJson(tree);

    if (
      !packageJson.devDependencies?.['@angular-eslint/schematics'] &&
      !packageJson.devDependencies?.['angular-eslint']
    ) {
      throw new Error(
        "The package 'angular-eslint' is not installed. " +
          "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start',
      );
    }

    return chain([
      modifyEsLintConfig(),
      modifyTsConfig(),
      hardenPackageVersion(),
    ]);
  };
}
