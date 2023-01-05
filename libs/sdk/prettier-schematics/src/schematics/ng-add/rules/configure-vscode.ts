import { Rule } from '@angular-devkit/schematics';

import { readJsonFile, writeJsonFile } from '../../utility/tree';
import { VSCodeExtensions } from '../types/vscode-extensions';
import { VSCodeSettings } from '../types/vscode-settings';

export function configureVSCode(): Rule {
  return (tree, context) => {
    const vsCodePath = '.vscode';
    const extensionsPath = `${vsCodePath}/extensions.json`;
    const settingsPath = `${vsCodePath}/settings.json`;
    const prettierExtensionName = 'esbenp.prettier-vscode';

    if (tree.getDir(vsCodePath).subfiles.length > 0) {
      context.logger.info(
        `Found ${vsCodePath} folder. Configuring Visual Studio Code for Prettier extension...`
      );

      if (!tree.exists(extensionsPath)) {
        tree.create(extensionsPath, '{}');
      }

      if (!tree.exists(settingsPath)) {
        tree.create(settingsPath, '{}');
      }

      const extensions = readJsonFile<VSCodeExtensions>(tree, extensionsPath);
      const settings = readJsonFile<VSCodeSettings>(tree, settingsPath);

      context.logger.info(
        'Adding Prettier extension to recommended extensions...'
      );

      extensions.recommendations = extensions.recommendations || [];

      if (!extensions.recommendations.includes(prettierExtensionName)) {
        extensions.recommendations.push(prettierExtensionName);
      }

      writeJsonFile(tree, extensionsPath, extensions);

      context.logger.info(
        'Setting Prettier as default formatter for workspace...'
      );

      settings['editor.defaultFormatter'] = prettierExtensionName;
      settings['editor.formatOnSave'] = true;
      settings['prettier.requireConfig'] = true;

      writeJsonFile(tree, settingsPath, settings);
    } else {
      console.log('NADA!');
    }
  };
}
