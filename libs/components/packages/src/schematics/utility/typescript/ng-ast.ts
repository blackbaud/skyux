import { tags } from '@angular-devkit/core';
import {
  getDecoratorMetadata,
  getMetadataField,
  isImported,
} from '@angular/cdk/schematics';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
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
          if (
            ts.isStringLiteralLike(template.initializer) ||
            ts.isNoSubstitutionTemplateLiteral(template.initializer)
          ) {
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

/**
 * Adds a symbol to the metadata of an Angular class (NgModule, Component, Directive).
 *
 * Derived from https://github.com/angular/angular-cli/blob/20.1.x/packages/schematics/angular/utility/ast-utils.ts
 */
export function addSymbolToClassMetadata(
  source: ts.SourceFile,
  decorator: 'NgModule' | 'Component' | 'Directive',
  filePath: string,
  metadataField: string,
  symbolName: string,
  importPath: string | null = null,
): Change[] {
  const nodes = getDecoratorMetadata(source, decorator, '@angular/core');
  const node = nodes[0];

  // Find the decorator declaration.
  if (!node || !ts.isObjectLiteralExpression(node)) {
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
    if (importPath !== null) {
      return [
        new InsertChange(filePath, position, toInsert),
        insertImport(
          source,
          filePath,
          symbolName.replace(/\..*$/, ''),
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

  if (importPath !== null) {
    return [
      new InsertChange(filePath, position, toInsert),
      insertImport(
        source,
        filePath,
        symbolName.replace(/\..*$/, ''),
        importPath,
      ),
    ];
  }

  return [new InsertChange(filePath, position, toInsert)];
}
