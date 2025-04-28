import { Rule, Tree } from '@angular-devkit/schematics';
import { VERSION } from '@angular/cli';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import semver from 'semver';

const ESLINT_CONFIG_EXTENDS_REGEXP = /(?<=extends:\s*\[)[^\]]*(?=])/g;

function needsComma(contents: string): boolean {
  const len = contents.length;

  for (let i = len; i > -1; i--) {
    // Starting at the end of the string, find the first non-whitespace character
    // and check if it's a comma. If it is, we don't need to insert one.
    const maybeComma = contents.at(i);
    if (maybeComma !== undefined && maybeComma.match(/[^\s]/)) {
      return maybeComma !== ',';
    }
  }

  /* istanbul ignore next: safety check */
  return true;
}

function getRootEslintConfigFilePath(tree: Tree): {
  configFile: string;
  isEsm: boolean;
} {
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

  let configFile: string | undefined;

  tree.getDir('/').visit((filePath) => {
    if (configFile) {
      return;
    }

    if (filePath.match(/^\/\.eslintrc/)) {
      throw new Error(
        "The 'skyux-eslint' package does not support ESLint's legacy config. " +
          'Migrate to ESLint\'s "flat" config and try the command again.',
      );
    }

    if (filePath.match(/^\/eslint\.config\.(js|mjs|cjs)$/)) {
      configFile = filePath;
    }
  });

  if (!configFile) {
    throw new Error('A compatible ESLint config file could not be found.');
  }

  const isEsm = tree.readText(configFile).includes('export default ');

  return { configFile, isEsm };
}

/**
 * Adds `skyux-eslint` to an existing `angular-eslint` config file.
 */
export default function ngAdd(): Rule {
  return (tree) => {
    const { configFile, isEsm } = getRootEslintConfigFilePath(tree);

    const contents = tree.readText(configFile);
    const importStatement = isEsm
      ? 'import skyux from "skyux-eslint";\n'
      : 'const skyux = require("skyux-eslint");\n';

    if (contents.includes(importStatement)) {
      return;
    }

    const recorder = tree.beginUpdate(configFile);

    const exportsRegexp = isEsm ? /\nexport default / : /\nmodule\.exports/;
    const exportsMatch = exportsRegexp.exec(contents);

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
        `${needsComma(element) ? ',' : ''}${' '.repeat(2)}...${statements.pop()},\n${' '.repeat(4)}`,
      );
    });

    tree.commitUpdate(recorder);
  };
}
