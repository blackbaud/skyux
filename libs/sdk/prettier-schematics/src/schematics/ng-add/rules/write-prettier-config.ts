import { Rule } from '@angular-devkit/schematics';

import { writeJsonFile } from '../../utility/tree';

export function writePrettierConfig(): Rule {
  return (tree, context) => {
    const configPaths = ['.prettierrc.json', '.prettierrc'];

    for (const filePath of configPaths) {
      if (tree.exists(filePath)) {
        context.logger.info(
          `Prettier config found at "${filePath}". Ignoring config update.`
        );
        return;
      }
    }

    const filePath = configPaths[0];

    context.logger.info(`Creating ${filePath} file with default settings...`);

    const prettierConfig = {
      singleQuote: true,
    };

    writeJsonFile(tree, filePath, prettierConfig);
  };
}
