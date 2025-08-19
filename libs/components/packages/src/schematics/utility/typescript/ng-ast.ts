import { tags } from '@angular-devkit/core';
import {
  getDecoratorMetadata,
  getMetadataField,
  isImported,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';

export function getInlineTemplates(
  sourceFile: ts.SourceFile,
): { start: number; end: number }[] {
  if (isImported(sourceFile, 'Component', '@angular/core')) {
    const components = getDecoratorMetadata(
      sourceFile,
      'Component',
      '@angular/core',
    );
    const templates = components
      .filter((component) => ts.isObjectLiteralExpression(component))
      .flatMap((component) => getMetadataField(component, 'template'))
      .filter((template) => ts.isPropertyAssignment(template));
    if (templates.length > 0) {
      return templates
        .map((template) => {
          if (ts.isStringLiteralLike(template.initializer)) {
            return {
              start: template.initializer.getStart() + 1,
              end: template.initializer.getEnd() - 1, // Exclude quotes
            };
          }
          return undefined;
        })
        .filter(Boolean) as { start: number; end: number }[];
    }
  }
  return [];
}

export function getTemplateUrls(sourceFile: ts.SourceFile): string[] {
  if (isImported(sourceFile, 'Component', '@angular/core')) {
    const components = getDecoratorMetadata(
      sourceFile,
      'Component',
      '@angular/core',
    );
    const templates = components
      .filter((component) => ts.isObjectLiteralExpression(component))
      .flatMap((component) => getMetadataField(component, 'templateUrl'))
      .filter((template) => ts.isPropertyAssignment(template));
    if (templates.length > 0) {
      return templates
        .map((template) => {
          if (ts.isStringLiteralLike(template.initializer)) {
            const quoted = template.initializer.getText();
            return quoted.substring(1, quoted.length - 1);
          }
          return undefined;
        })
        .filter(Boolean) as string[];
    }
  }
  return [];
}

/**
 * Like `getDecoratorMetadata` from @angular/cdk/schematics, but for `TestBed.configureTestingModule`.
 */
export function getTestingModuleMetadata(
  source: ts.SourceFile,
): ts.ObjectLiteralExpression[] {
  return findNodes(
    source,
    (node: ts.Node): node is ts.ObjectLiteralExpression =>
      ts.isObjectLiteralExpression(node) &&
      ts.isCallExpression(node.parent) &&
      node.parent.expression.getText().trim() ===
        'TestBed.configureTestingModule',
  );
}

/**
 * Determines whether a component is standalone from its metadata.
 */
export function isStandaloneComponent(
  metadata: ts.ObjectLiteralExpression,
): boolean {
  const standalone = getMetadataField(metadata, 'standalone');
  return (
    !standalone[0] ||
    (ts.isPropertyAssignment(standalone[0]) &&
      standalone[0].initializer.kind === ts.SyntaxKind.TrueKeyword)
  );
}

/**
 * Adds a symbol to the metadata of an Angular class (NgModule, Component, Directive).
 *
 * Derived from https://github.com/angular/angular-cli/blob/20.1.x/packages/schematics/angular/utility/ast-utils.ts
 */
export function addSymbolToClassMetadata(
  source: ts.SourceFile,
  decorator:
    | 'NgModule'
    | 'Component'
    | 'Directive'
    | 'TestBed.configureTestingModule',
  filePath: string,
  metadataField: string,
  symbolName: string,
  importPath: string | null = null,
): Change[] {
  const nodes =
    'TestBed.configureTestingModule' === decorator
      ? getTestingModuleMetadata(source)
      : getDecoratorMetadata(source, decorator, '@angular/core');
  let insertedImport = false;
  return nodes
    .filter((node) => !!node && ts.isObjectLiteralExpression(node))
    .flatMap((node): Change[] => {
      if (
        importPath === '@angular/common' &&
        isSymbolInClassMetadataFieldArray(node, metadataField, 'CommonModule')
      ) {
        // Special case: don't add children of CommonModule if it's already present.
        return [];
      }

      // Get all the children property assignment of object literals.
      const matchingProperties = getMetadataField(node, metadataField);

      if (!matchingProperties.length) {
        // We haven't found the field in the metadata declaration. Insert a new field.
        let position: number;
        let toInsert: string;
        if (!node.properties.length) {
          position = node.getEnd() - 1;
          toInsert = `\n  ${metadataField}: [\n${tags.indentBy(4)`${symbolName}`}\n  ]\n`;
        } else {
          const childNode = node.properties[node.properties.length - 1];
          position = childNode.getEnd();
          // Get the indentation of the last element, if any.
          const text = childNode.getFullText(source);
          const matches = text.match(/^(\r?\n)(\s*)/);
          if (matches) {
            toInsert =
              `,${matches[0]}${metadataField}: [${matches[1]}` +
              `${tags.indentBy(matches[2].length + 2)`${symbolName}`}${matches[0]}]`;
          } else {
            toInsert = `, ${metadataField}: [${symbolName}]`;
          }
        }
        if (importPath !== null && !insertedImport) {
          insertedImport = true;
          return [
            new InsertChange(filePath, position, toInsert),
            insertImport(
              source,
              filePath,
              // Remove function call syntax (e.g., SomeSymbol()) and property access (e.g., SomeSymbol.method) from symbolName for import.
              symbolName.replace(/(\.\w+|\(.*\))$/, ''),
              importPath,
            ),
          ];
        } else {
          return [new InsertChange(filePath, position, toInsert)];
        }
      }
      const assignment = matchingProperties[0];

      // If it's not an array, nothing we can do really.
      if (
        !ts.isPropertyAssignment(assignment) ||
        !ts.isArrayLiteralExpression(assignment.initializer)
      ) {
        return [];
      }

      let expression: ts.Expression | ts.ArrayLiteralExpression;
      const assignmentInit = assignment.initializer;
      const elements = assignmentInit.elements;

      if (elements.length) {
        const symbolsArray = elements.map(
          (node) => tags.oneLine`${node.getText()}`,
        );
        if (symbolsArray.includes(tags.oneLine`${symbolName}`)) {
          return [];
        }

        expression = elements[elements.length - 1];
      } else {
        expression = assignmentInit;
      }

      let toInsert: string;
      let position = expression.getEnd();
      if (ts.isArrayLiteralExpression(expression)) {
        // We found the field but it's empty. Insert it just before the `]`.
        position--;
        toInsert = `\n${tags.indentBy(4)`${symbolName}`}\n  `;
      } else {
        // Get the indentation of the last element, if any.
        const text = expression.getFullText(source);
        const matches = text.match(/^(\r?\n)(\s*)/);
        if (matches) {
          toInsert = `,${matches[1]}${tags.indentBy(matches[2].length)`${symbolName}`}`;
        } else {
          toInsert = `, ${symbolName}`;
        }
      }

      if (importPath !== null && !insertedImport) {
        insertedImport = true;
        return [
          new InsertChange(filePath, position, toInsert),
          insertImport(
            source,
            filePath,
            symbolName.replace(/[.(].*$/, ''),
            importPath,
          ),
        ];
      }

      return [new InsertChange(filePath, position, toInsert)];
    });
}

/**
 * Checks if a symbol is present in a class metadata field array.
 */
export function isSymbolInClassMetadataFieldArray(
  node: ts.ObjectLiteralExpression,
  metadataField: string,
  symbolName: string,
): boolean {
  const matchingProperties = getMetadataField(node, metadataField);

  if (!matchingProperties.length) {
    return false;
  }
  const assignment = matchingProperties[0];

  if (
    !ts.isPropertyAssignment(assignment) ||
    !ts.isArrayLiteralExpression(assignment.initializer)
  ) {
    return false;
  }

  const assignmentInit = assignment.initializer;
  const elements = assignmentInit.elements;

  const symbolsArray = elements.map((node) => tags.oneLine`${node.getText()}`);
  return symbolsArray.includes(tags.oneLine`${symbolName}`);
}
