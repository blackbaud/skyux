import { Rule } from '@angular-devkit/schematics';

import { writeJsonFile } from '../../utility/tree';

export function writePrettierConfig(): Rule {
  return (tree, context) => {
    const filePath = '.prettierrc.json';

    context.logger.info(`Creating ${filePath} file with default settings...`);

    const prettierConfig = {
      singleQuote: true,
    };

    writeJsonFile(tree, filePath, prettierConfig);
  };
}
