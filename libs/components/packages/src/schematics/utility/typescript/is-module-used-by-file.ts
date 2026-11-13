import { dirname, join, normalize } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import {
  findNodes,
  getDecoratorMetadata,
  getMetadataField,
} from '@schematics/angular/utility/ast-utils';
import ts from 'typescript';

import {
  getInlineTemplates,
  getTemplateUrls,
  getTestingModuleMetadata,
  parseSourceFile,
} from './ng-ast';
import { isDecoratorMetadataArray } from './remove-class-reference';

/**
 * True if a component in the file renders one of `elementNames` in its inline
 * template or its `templateUrl`. A template that can't be read counts as
 * rendering one, so a migration never removes a module a template needs.
 */
function componentsRenderElement(
  tree: Tree,
  filePath: string,
  elementNames: string[],
): boolean {
  const source = parseSourceFile(tree, filePath);
  const rendersElement = (template: string): boolean =>
    elementNames.some((elementName) => template.includes(`<${elementName}`));

  return (
    getInlineTemplates(source).some((template) =>
      rendersElement(source.text.slice(template.start, template.end)),
    ) ||
    getTemplateUrls(source).some((templateUrl) => {
      const templatePath = join(dirname(normalize(filePath)), templateUrl);

      return (
        !tree.exists(templatePath) ||
        rendersElement(tree.readText(templatePath))
      );
    })
  );
}

/**
 * True if a component that an NgModule or `TestBed` in the file declares
 * renders one of `elementNames`. A component declared in the same file is
 * covered by `componentsRenderElement`. One imported from a file that doesn't
 * define it (a barrel, a package or a missing file) counts as rendering one.
 */
function declaresElementComponent(
  tree: Tree,
  filePath: string,
  source: ts.SourceFile,
  elementNames: string[],
): boolean {
  const declarations = [
    ...getDecoratorMetadata(source, 'NgModule', '@angular/core'),
    ...getTestingModuleMetadata(source),
  ]
    .filter(ts.isObjectLiteralExpression)
    .flatMap((metadata) => getMetadataField(metadata, 'declarations'))
    .filter(ts.isPropertyAssignment)
    .map((property) => property.initializer)
    .filter(ts.isArrayLiteralExpression)
    .flatMap((array) => array.elements)
    .filter(ts.isIdentifier)
    .map((element) => element.text);

  return declarations.some((name) => {
    const specifier = findNodes(source, ts.isImportSpecifier).find(
      (node) => node.name.text === name,
    )?.parent.parent.parent.moduleSpecifier;

    if (!specifier) {
      return false;
    }

    const componentPath = `${join(
      dirname(normalize(filePath)),
      (specifier as ts.StringLiteral).text,
    )}.ts`;

    return (
      !tree.exists(componentPath) ||
      !tree.readText(componentPath).includes(`class ${name}`) ||
      componentsRenderElement(tree, componentPath, elementNames)
    );
  });
}

/**
 * True if the file hands one of `moduleClassNames` to code a migration can't
 * trace, through an NgModule's `exports`, a plain array or any other reference
 * outside `imports`.
 */
function sharesModule(
  source: ts.SourceFile,
  moduleClassNames: string[],
): boolean {
  return findNodes(source, ts.isIdentifier).some(
    (node) =>
      moduleClassNames.includes(node.text) &&
      !ts.isImportSpecifier(node.parent) &&
      !(
        ts.isArrayLiteralExpression(node.parent) &&
        isDecoratorMetadataArray(node.parent, ['imports'])
      ),
  );
}

/**
 * True if the file's components, NgModules or `TestBed` setups need one of
 * `moduleClassNames`: one of their own templates, or one of their declared
 * components' templates, renders one of `elementNames` (the module's
 * selectors), or the file shares the module beyond its own `imports`. A
 * migration can then swap the module only where it's used, and remove it
 * elsewhere.
 */
export function isModuleUsedByFile(
  tree: Tree,
  filePath: string,
  moduleClassNames: string[],
  elementNames: string[],
): boolean {
  const source = parseSourceFile(tree, filePath);

  return (
    sharesModule(source, moduleClassNames) ||
    componentsRenderElement(tree, filePath, elementNames) ||
    declaresElementComponent(tree, filePath, source, elementNames)
  );
}
