import { Rule, Tree, chain } from '@angular-devkit/schematics';

import { readJson } from 'fs-extra';
import { resolve } from 'path';

import { modifyEsLintConfig } from '../shared/rules/modify-eslint-config';
import { modifyTsConfig } from '../shared/rules/modify-tsconfig';
import { PackageJson } from '../shared/types/package-json';
import { readRequiredFile } from '../shared/utility/tree';

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

export default function ngAdd(): Rule {
  return (tree) => {
    const packageJson = getPackageJson(tree);

    if (!packageJson.devDependencies?.['@angular-eslint/schematics']) {
      throw new Error(
        "The package '@angular-eslint/schematics' is not installed. " +
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
