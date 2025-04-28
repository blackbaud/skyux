import { Rule } from '@angular-devkit/schematics';

import { writeJsonFile } from '../../utility/tree';

export function writePrettierConfig(args: { importSorting: boolean }): Rule {
  return (tree, context) => {
    const { importSorting } = args;

    const configPaths = ['.prettierrc.json', '.prettierrc'];

    for (const filePath of configPaths) {
      if (tree.exists(filePath)) {
        context.logger.info(
          `Prettier config found at "${filePath}". Ignoring config update.`,
        );
        return;
      }
    }

    const filePath = configPaths[0];

    context.logger.info(`Creating ${filePath} file with default settings...`);

    const prettierConfig = {
      singleQuote: true,
    };

    if (importSorting) {
      Object.assign(prettierConfig, {
        importOrder: ['^@(.*)$', '^\\w(.*)$', '^(../)(.*)$', '^(./)(.*)$'],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
        plugins: ['@trivago/prettier-plugin-sort-imports'],
      });
    }

    writeJsonFile(tree, filePath, prettierConfig);
  };
}
