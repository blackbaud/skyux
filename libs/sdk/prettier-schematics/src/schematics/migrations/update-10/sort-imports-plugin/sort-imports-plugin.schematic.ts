import { Rule } from '@angular-devkit/schematics';

import { readJsonFile, writeJsonFile } from '../../../utility/tree';

const PLUGIN_NAME = '@trivago/prettier-plugin-sort-imports';

export default function fixSortImportsPlugin(): Rule {
  return (tree) => {
    const prettierConfigPath = '/.prettierrc.json';

    const packageJson = readJsonFile<{
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    }>(tree, '/package.json');

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (tree.exists(prettierConfigPath) && PLUGIN_NAME in dependencies) {
      const prettierConfig = readJsonFile<Record<string, unknown>>(
        tree,
        prettierConfigPath,
      );

      const plugins: string[] =
        (prettierConfig['plugins'] as string[] | undefined) ?? [];

      if (!plugins.includes(PLUGIN_NAME)) {
        plugins.push(PLUGIN_NAME);
        prettierConfig['plugins'] = plugins;
        writeJsonFile(tree, prettierConfigPath, prettierConfig);
      }
    }
  };
}
