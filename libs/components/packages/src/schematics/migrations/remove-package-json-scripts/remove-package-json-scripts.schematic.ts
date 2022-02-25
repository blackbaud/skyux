import { Rule } from '@angular-devkit/schematics';

import { readRequiredFile } from '../../utility/tree';

export default function (): Rule {
  return async (tree) => {
    const filePath = 'package.json';
    const packageJson = JSON.parse(readRequiredFile(tree, filePath));

    delete packageJson.scripts['skyux:update'];
    delete packageJson.scripts['skyux:update-angular'];
    delete packageJson.scripts['skyux:update-skyux'];

    tree.overwrite(filePath, JSON.stringify(packageJson, undefined, 2));
  };
}
