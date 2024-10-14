import { Rule, Tree } from '@angular-devkit/schematics';

import { readRequiredFile, writeJsonFile } from '../../../utility/tree';

function getVSCodeSettings(tree: Tree): {
  'eslint.useFlatConfig'?: boolean;
} {
  if (tree.exists('.vscode/settings.json')) {
    return JSON.parse(readRequiredFile(tree, '.vscode/settings.json'));
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

  if (!found && tree.exists('/package.json')) {
    found = !!JSON.parse(readRequiredFile(tree, '/package.json'))[
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
      writeJsonFile(tree, '.vscode/settings.json', currentSettings);
    }
  };
}
