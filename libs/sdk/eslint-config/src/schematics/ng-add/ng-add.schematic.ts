import { Rule, chain } from '@angular-devkit/schematics';

import { installDependencies } from '../shared/rules/install-dependencies';
import { modifyEsLintConfig } from '../shared/rules/modify-eslint-config';
import { PackageJson } from '../shared/types/package-json';
import { readRequiredFile } from '../shared/utility/tree';

export default function ngAdd(): Rule {
  return (tree) => {
    const packageJson = JSON.parse(
      readRequiredFile(tree, '/package.json')
    ) as PackageJson;

    if (!packageJson.devDependencies?.['@angular-eslint/schematics']) {
      throw new Error(
        "The package '@angular-eslint/schematics' is not installed. " +
          "Run 'ng add @angular-eslint/schematics' and try this command again.\n" +
          'See: https://github.com/angular-eslint/angular-eslint#quick-start'
      );
    }

    return chain([installDependencies(), modifyEsLintConfig()]);
  };
}
