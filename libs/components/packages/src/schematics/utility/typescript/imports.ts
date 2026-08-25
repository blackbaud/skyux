import { UpdateRecorder } from '@angular-devkit/schematics';
import ts from 'typescript';

export interface NamedImportDeclaration {
  declaration: ts.ImportDeclaration;
  importClause: ts.ImportClause;
  namedBindings: ts.NamedImports;
  specifiers: readonly ts.ImportSpecifier[];
}

/**
 * Returns every `import { ... } from '<moduleName>'` declaration in the file.
 * Namespace and default-only imports are skipped since they have no specifiers
 * to operate on.
 */
export function getNamedImportDeclarations(
  sourceFile: ts.SourceFile,
  moduleName: string,
): NamedImportDeclaration[] {
  const declarations: NamedImportDeclaration[] = [];

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== moduleName
    ) {
      continue;
    }

    const importClause = statement.importClause;
    const namedBindings = importClause?.namedBindings;

    if (!importClause || !namedBindings || !ts.isNamedImports(namedBindings)) {
      continue;
    }

    declarations.push({
      declaration: statement,
      importClause,
      namedBindings,
      specifiers: namedBindings.elements,
    });
  }

  return declarations;
}

/**
 * Returns the text of a specifier, moving the declaration's `type` modifier
 * onto the specifier so it survives being merged into a value import.
 */
export function getSpecifierText(
  specifier: ts.ImportSpecifier,
  isTypeOnly: boolean,
): string {
  const text = specifier.getText();

  return isTypeOnly && !specifier.isTypeOnly ? `type ${text}` : text;
}

export function replaceNode(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  node: ts.Node,
  text: string,
): void {
  const start = node.getStart(sourceFile);

  recorder.remove(start, node.getEnd() - start);
  recorder.insertRight(start, text);
}

/**
 * Removes a statement along with the rest of the line it ends on, so deleting
 * an import doesn't leave a blank line behind.
 */
export function removeStatement(
  recorder: UpdateRecorder,
  sourceFile: ts.SourceFile,
  node: ts.Node,
): void {
  const start = node.getStart(sourceFile);
  const end = node.getEnd();
  const trailing = /^[^\S\n]*\n?/.exec(sourceFile.text.substring(end));

  recorder.remove(start, end - start + (trailing ? trailing[0].length : 0));
}
