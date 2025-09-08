import { Rule, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { isImported, parseSourceFile } from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes } from '@schematics/angular/utility/ast-utils';
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
            !element.attrs.some((attr) =>
              ['[variant]', 'variant'].includes(attr.name),
            )
              ? ` variant="${iconReplacementInfo.variant}"`
              : ''),
        );
      }
    }
    if (componentInfo.selector === 'sky-icon') {
      const removedAttrs = [
        'fixedWidth',
        '[fixedWidth]',
        'iconType',
        '[iconType]',
      ].map((attr) => attr.toLowerCase());
      element.attrs
        .filter((attr) => removedAttrs.includes(attr.name))
        .forEach((attr) => {
          recorder.remove(
            element.sourceCodeLocation.attrs[attr.name].startOffset + offset,
            element.sourceCodeLocation.attrs[attr.name].endOffset -
              element.sourceCodeLocation.attrs[attr.name].startOffset,
          );
        });
    }
  });
}

function objectIsAssignedToDataViewConfigVariableOrProperty(
  node: ts.ObjectLiteralExpression,
  source: ts.SourceFile,
): boolean {
  return (
    (ts.isVariableDeclaration(node.parent) ||
      ts.isPropertyDeclaration(node.parent)) &&
    node.parent.type?.getText(source) === 'SkyDataViewConfig'
  );
}

function objectIsInitDataViewParameter(
  node: ts.ObjectLiteralExpression,
): boolean {
  return (
    ts.isCallExpression(node.parent) &&
    ts.isPropertyAccessExpression(node.parent.expression) &&
    node.parent.expression.name.text === 'initDataView'
  );
}

function objectIsAssignedToDataViewConfigProperty(
  node: ts.ObjectLiteralExpression,
  uninitializedDataViewConfigs: string[],
): boolean {
  return (
    ts.isBinaryExpression(node.parent) &&
    ts.isPropertyAccessExpression(node.parent.left) &&
    node.parent.left.expression.kind === ts.SyntaxKind.ThisKeyword &&
    uninitializedDataViewConfigs.includes(node.parent.left.name.text) &&
    node.parent.operatorToken.kind === ts.SyntaxKind.EqualsToken
  );
}

function updateDataViewConfig(
  source: ts.SourceFile,
  recorder: UpdateRecorder,
): void {
  const checkSkyDataViewConfig =
    isImported(source, 'SkyDataViewConfig', '@skyux/data-manager') ||
    isImported(source, 'SkyDataManagerService', '@skyux/data-manager');
  if (checkSkyDataViewConfig) {
    const uninitializedDataViewConfigs = findNodes(
      source,
      (node): node is ts.PropertyDeclaration =>
        ts.isPropertyDeclaration(node) &&
        !!node.type &&
        (node.type.getText(source) === 'SkyDataViewConfig' ||
          // Find e.g., SkyDataViewConfig | undefined
          (ts.isUnionTypeNode(node.type) &&
            node.type.types.some(
              (type) =>
                ts.isTypeReferenceNode(type) &&
                type.typeName.getText(source) === 'SkyDataViewConfig',
            ))) &&
        !node.initializer,
    ).map((node): string => node.name.getText(source));
    const dataViewConfig = findNodes(
      source,
      (node): node is ts.ObjectLiteralExpression =>
        !!node.parent &&
        ts.isObjectLiteralExpression(node) &&
        // Object typed as SkyDataViewConfig via variable or property declaration.
        (objectIsAssignedToDataViewConfigVariableOrProperty(node, source) ||
          // Object parameter to SkyDataManagerService.initDataView(), inferred type.
          objectIsInitDataViewParameter(node) ||
          // Object assigned to a property previously typed as SkyDataViewConfig.
          objectIsAssignedToDataViewConfigProperty(
            node,
            uninitializedDataViewConfigs,
          )),
    );
    dataViewConfig.forEach((node) => {
      const iconProperty = node.properties.find(
        (prop): prop is ts.PropertyAssignment =>
          ts.isPropertyAssignment(prop) && prop.name.getText(source) === 'icon',
      );
      if (iconProperty && ts.isStringLiteral(iconProperty.initializer)) {
        const iconName = iconProperty.initializer.text;
        const iconReplacementInfo = IconNameMappings[iconName];
        if (iconReplacementInfo) {
          // Replace the property name to `iconName` and update the value. Leave the initial whitespace.
          recorder.remove(
            iconProperty.name.end - 'icon'.length,
            iconProperty.end - iconProperty.name.end + 'icon'.length,
          );
          recorder.insertLeft(
            iconProperty.name.end - 'icon'.length,
            `iconName: '${iconReplacementInfo.newName}'`,
          );
        }
      }
    });
  }
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
        const recorder = tree.beginUpdate(filePath);
        if (isImported(source, 'Component', '@angular/core')) {
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
        }
        updateDataViewConfig(source, recorder);
        tree.commitUpdate(recorder);
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
