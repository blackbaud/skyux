import { Rule, Tree, chain } from '@angular-devkit/schematics';
import { VERSION } from '@angular/cli';
import * as prompt from '@inquirer/prompts';
import { getPackageJsonDependency } from '@schematics/angular/utility/dependencies';

import semver from 'semver';

import { JsonFile } from '../utility/json-file';

import { SkyuxEslintAddOptions } from './schema';

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

function modifyTypeScriptEslintRulesets(options: SkyuxEslintAddOptions): Rule {
  return (tree) => {
    if (options.ruleset === 'strict-type-checked') {
      const contents = tree.readText('/eslint.config.js');

      // A new Angular CLI project installs "recommended" and "stylistic"
      // typescript-eslint configurations, but we want consumers to use the
      // type-checked rules.
      const modified = contents
        .replaceAll(
          'tseslint.configs.recommended,',
          'tseslint.configs.recommendedTypeChecked,',
        )
        .replaceAll(
          'tseslint.configs.stylistic,',
          'tseslint.configs.stylisticTypeChecked,',
        );

      if (contents !== modified) {
        tree.overwrite('/eslint.config.js', modified);
      }
    }
  };
}

function modifyTsConfig(options: SkyuxEslintAddOptions): Rule {
  return (tree) => {
    if (options.ruleset === 'strict-type-checked') {
      const tsconfig = new JsonFile(tree, '/tsconfig.json');

      // Strict null checks are needed for the '@typescript/eslint:prefer-nullish-coalescing' rule.
      // The `strict` option also sets `strictNullChecks` so we can abort if it's set to true.
      if (tsconfig.get(['compilerOptions', 'strict']) !== true) {
        tsconfig.modify(['compilerOptions', 'strictNullChecks'], true);
      }
    }
  };
}

async function promptMissingOptions(
  options: SkyuxEslintAddOptions,
): Promise<Required<SkyuxEslintAddOptions>> {
  const settings: Required<SkyuxEslintAddOptions> = {
    ruleset: options.ruleset ?? 'recommended',
  };

  if (options.ruleset === undefined) {
    settings.ruleset = await prompt.select({
      message:
        'Which ruleset would you like to install? Choose "recommended" to ' +
        'install recommended SKY UX rules. Choose "strict-type-checked" to ' +
        'install the recommended rules, and additional best-practice rules.',
      choices: ['recommended', 'strict-type-checked'],
    });
  }

  return settings;
}

/**
 * Adds `skyux-eslint` to an existing ESLint config file.
 */
export default function ngAdd(options: SkyuxEslintAddOptions): Rule {
  return async (tree) => {
    const settings = await promptMissingOptions(options);

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

    const statements =
      settings.ruleset === 'recommended'
        ? ['skyux.configs.templateRecommended', 'skyux.configs.tsRecommended']
        : ['skyux.configs.templateRecommended', 'skyux.configs.tsRecommended'];

    contents.match(ESLINT_CONFIG_EXTENDS_REGEXP)?.forEach((element) => {
      recorder.insertRight(
        contents.indexOf(element) + element.length,
        `${needsComma(element) ? ',' : ''}${' '.repeat(2)}...${statements.pop()},\n${' '.repeat(4)}`,
      );
    });

    tree.commitUpdate(recorder);

    return chain([
      modifyTsConfig(settings),
      modifyTypeScriptEslintRulesets(settings),
    ]);
  };
}
