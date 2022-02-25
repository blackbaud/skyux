import { Rule } from '@angular-devkit/schematics';

import { readJsonFile, writeJsonFile } from '../../utility/tree';

export function addFormatNpmScript(): Rule {
  return (tree) => {
    const packageJson = readJsonFile<{
      scripts: {
        [_: string]: string;
      };
    }>(tree, 'package.json');

    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts['skyux:format'] = 'npx prettier --write .';

    writeJsonFile(tree, 'package.json', packageJson);
  };
}
