import { Rule, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import { visitProjectFiles } from '../../../utility/visit-project-files';

import { IconNameMappings } from './icon-name-mappings';

const COMPONENTS_WITH_ICON: {
  selector: string;
  inputName: string;
  honorReplacementVariant: boolean;
}[] = [
  {
    selector: 'sky-icon',
    inputName: 'icon',
    honorReplacementVariant: true,
  },
  {
    selector: 'sky-action-button-icon',
    inputName: 'iconType',
    honorReplacementVariant: false,
  },
  {
    selector: 'sky-radio',
    inputName: 'icon',
    honorReplacementVariant: false,
  },
  {
    selector: 'sky-checkbox',
    inputName: 'icon',
    honorReplacementVariant: false,
  },
];

function updateIcon(
  html: string,
  componentInfo: {
    selector: string;
    inputName: string;
    honorReplacementVariant: boolean;
  },
): string {
  const regex = new RegExp(
    `<${componentInfo.selector}[^>]*(?<propertyAndValue> ${componentInfo.inputName}="(?<iconValue>[^"]+)")[^>]*>`,
    'g',
  );
  return html.replaceAll(
    regex,
    (currentString, propertyAndValue, iconValue) => {
      const iconReplacementInfo = IconNameMappings[iconValue];
      if (!iconReplacementInfo) {
        return currentString;
      }
      return currentString.replace(
        propertyAndValue,
        ` iconName="${iconReplacementInfo.newName}"` +
          (componentInfo.honorReplacementVariant &&
          iconReplacementInfo.variant &&
          !currentString.includes('variant=') &&
          !currentString.includes('[variant]=')
            ? ` variant="${iconReplacementInfo.variant}"`
            : ''),
      );
    },
  );
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const { workspace } = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
        const content = tree.readText(filePath);
        let updatedContent = content;

        COMPONENTS_WITH_ICON.forEach((componentInfo) => {
          updatedContent = updateIcon(updatedContent, componentInfo);
        });
        if (updatedContent !== content) {
          tree.overwrite(filePath, updatedContent);
        }
      }
    });
  });
}

/**
 * Rename tabIndex inputs on sky-tab to tabIndexValue.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
