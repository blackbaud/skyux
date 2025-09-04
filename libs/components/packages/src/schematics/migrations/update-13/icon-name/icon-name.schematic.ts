import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { isImported, parseSourceFile } from '@angular/cdk/schematics';
import { getWorkspace } from '@schematics/angular/utility/workspace';

import {
  ParentNode,
  getElementsByTagName,
  parseTemplate,
} from '../../../utility/template';
import { getInlineTemplates } from '../../../utility/typescript/ng-ast';
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
  doc: ParentNode,
  componentInfo: {
    selector: string;
    inputName: string;
    honorReplacementVariant: boolean;
  },
  offset: number,
  recorder: UpdateRecorder,
): void {
  const elements = getElementsByTagName(componentInfo.selector, doc);
  elements.forEach((element) => {
    const iconAttr = element.attrs.find(
      (attr) => attr.name === componentInfo.inputName.toLowerCase(),
    );
    if (iconAttr?.value) {
      const iconReplacementInfo = IconNameMappings[iconAttr.value];
      if (iconReplacementInfo) {
        recorder.remove(
          element.sourceCodeLocation.attrs[iconAttr.name].startOffset + offset,
          element.sourceCodeLocation.attrs[iconAttr.name].endOffset -
            element.sourceCodeLocation.attrs[iconAttr.name].startOffset,
        );
        recorder.insertLeft(
          element.sourceCodeLocation.attrs[iconAttr.name].startOffset + offset,
          `iconName="${iconReplacementInfo.newName}"` +
            (componentInfo.honorReplacementVariant &&
            iconReplacementInfo.variant &&
            !element.attrs.find((attr) =>
              ['[variant]', 'variant'].includes(attr.name),
            )
              ? ` variant="${iconReplacementInfo.variant}"`
              : ''),
        );
      }
    }
    if (componentInfo.selector === 'sky-icon') {
      const fixedWidthAttr = element.attrs.find((attr) =>
        ['fixedWidth'.toLowerCase(), '[fixedWidth]'.toLowerCase()].includes(
          attr.name,
        ),
      );
      if (fixedWidthAttr) {
        recorder.remove(
          element.sourceCodeLocation.attrs[fixedWidthAttr.name].startOffset +
            offset,
          element.sourceCodeLocation.attrs[fixedWidthAttr.name].endOffset -
            element.sourceCodeLocation.attrs[fixedWidthAttr.name].startOffset,
        );
      }
    }
  });
}

async function updateSourceFiles(tree: Tree): Promise<void> {
  const workspace = await getWorkspace(tree);

  workspace.projects.forEach((project) => {
    visitProjectFiles(tree, project.sourceRoot || project.root, (filePath) => {
      if (filePath.endsWith('.html')) {
        const doc = parseTemplate(tree.readText(filePath));
        const recorder = tree.beginUpdate(filePath);
        COMPONENTS_WITH_ICON.forEach((componentInfo) => {
          updateIcon(doc, componentInfo, 0, recorder);
        });
        tree.commitUpdate(recorder);
      }
      if (filePath.endsWith('.ts')) {
        const source = parseSourceFile(tree, filePath);
        if (isImported(source, 'Component', '@angular/core')) {
          const recorder = tree.beginUpdate(filePath);
          const content = tree.readText(filePath);
          const templates = getInlineTemplates(source);
          templates.forEach((template) => {
            const doc = parseTemplate(
              content.substring(template.start, template.end),
            );
            COMPONENTS_WITH_ICON.forEach((componentInfo) => {
              updateIcon(doc, componentInfo, template.start, recorder);
            });
          });
          tree.commitUpdate(recorder);
        }
      }
    });
  });
}

/**
 * Update icon names to match the latest SkyIcon names, and remove the
 * fixedWidth input from sky-icon components.
 */
export default function (): Rule {
  return async (tree: Tree): Promise<void> => {
    await updateSourceFiles(tree);
  };
}
