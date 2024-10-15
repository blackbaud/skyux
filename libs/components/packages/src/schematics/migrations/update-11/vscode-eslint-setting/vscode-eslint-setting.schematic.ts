import { Rule, Tree } from '@angular-devkit/schematics';

import { readRequiredFile, writeJsonFile } from '../../../utility/tree';

const packageJsonPath = '/package.json';
const vscodeSettingsPath = '.vscode/settings.json';

function getVSCodeSettings(tree: Tree): {
  'eslint.useFlatConfig'?: boolean;
} {
  if (tree.exists(vscodeSettingsPath)) {
    return JSON.parse(readRequiredFile(tree, vscodeSettingsPath));
  } else {
    return {};
  }
}

function legacyEslintConfigExists(tree: Tree): boolean {
  const possibleConfigFiles = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
  ];

  let found = false;
  possibleConfigFiles.forEach((possibleConfigFile) => {
    if (tree.exists(possibleConfigFile)) {
      found = true;
    }
  });

  if (!found && tree.exists(packageJsonPath)) {
    found = !!JSON.parse(readRequiredFile(tree, packageJsonPath))[
      'eslintConfig'
    ];
  }

  return found;
}

export default function (): Rule {
  return (tree) => {
    if (legacyEslintConfigExists(tree)) {
      const currentSettings = getVSCodeSettings(tree);

      currentSettings['eslint.useFlatConfig'] = false;
      writeJsonFile(tree, vscodeSettingsPath, currentSettings);
    }
  };
}
