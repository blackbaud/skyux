import { Tree } from '@angular-devkit/schematics';

export function getEslintConfigFile(tree: Tree): {
  eslintConfigFile: string | undefined;
  isEsm: boolean;
  isFlatConfig: boolean;
} {
  const flatConfigFiles = [
    '/eslint.config.js',
    '/eslint.config.mjs',
    '/eslint.config.cjs',
  ];

  const flatConfigFile = flatConfigFiles.find((file) => tree.exists(file));
  const rcConfigFile = '/.eslintrc.json';

  const isFlatConfig =
    flatConfigFile !== undefined && tree.exists(flatConfigFile);

  const isEsm =
    isFlatConfig && tree.readText(flatConfigFile).includes('export default');

  const eslintConfigFile = isFlatConfig
    ? flatConfigFile
    : tree.exists(rcConfigFile)
      ? rcConfigFile
      : undefined;

  return { eslintConfigFile, isFlatConfig, isEsm };
}
