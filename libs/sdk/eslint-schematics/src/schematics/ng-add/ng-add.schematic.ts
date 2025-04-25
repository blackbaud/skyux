import { Rule, Tree } from '@angular-devkit/schematics';
import { VERSION } from '@angular/cli';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import semver from 'semver';

const ESLINT_CONFIG_EXTENDS_REGEXP = /(?<=extends:\s*\[)[^\]]*(?=])/g;
const MODULE_EXPORTS_REGEXP = /\nmodule\.exports/;

function getRootEslintConfigFilePath(tree: Tree): string {
  if (!getPackageJsonDependency(tree, 'angular-eslint')) {
    throw new Error(
      "The package 'angular-eslint' is not installed. " +
        `Run 'ng add angular-eslint@${VERSION.major}' and try this command again.\n` +
        'See: https://github.com/angular-eslint/angular-eslint#quick-start',
    );
  }

  const eslintDependency = getPackageJsonDependency(tree, 'eslint');
  const eslintMajorVersion =
    eslintDependency && semver.minVersion(eslintDependency.version)?.major;

  if (eslintMajorVersion && eslintMajorVersion < 9) {
    throw new Error("The 'skyux-eslint' package requires eslint version 9.");
  }

  let foundFile: string | undefined;

  tree.getDir('/').visit((filePath) => {
    if (foundFile) {
      return;
    }

    if (filePath.match(/^\/\.eslintrc/)) {
      throw new Error(
        "The 'skyux-eslint' package does not support ESLint's legacy config. " +
          'Migrate to ESLint\'s "flat" config and try the command again.',
      );
    }

    if (filePath.match(/^\/eslint\.config\.(js|mjs|cjs)$/)) {
      foundFile = filePath;
    }
  });

  if (!foundFile) {
    throw new Error('A compatible ESLint config file could not be found.');
  }

  return foundFile;
}

/**
 * Adds `skyux-eslint` to an existing `angular-eslint` config file.
 */
export default function ngAdd(): Rule {
  return (tree) => {
    const configFile = getRootEslintConfigFilePath(tree);

    const contents = tree.readText(configFile);
    const importStatement = 'const skyux = require("skyux-eslint");\n';

    if (contents.includes(importStatement)) {
      return;
    }

    const recorder = tree.beginUpdate(configFile);

    const exportsMatch = MODULE_EXPORTS_REGEXP.exec(contents);

    if (exportsMatch) {
      recorder.insertLeft(exportsMatch.index, importStatement);
    }

    const statements = [
      'skyux.configs.templateRecommended',
      'skyux.configs.tsRecommended',
    ];

    contents.match(ESLINT_CONFIG_EXTENDS_REGEXP)?.forEach((element) => {
      recorder.insertRight(
        contents.indexOf(element) + element.length,
        `${' '.repeat(2)}...${statements.pop()},\n${' '.repeat(4)}`,
      );
    });

    tree.commitUpdate(recorder);
  };
}
