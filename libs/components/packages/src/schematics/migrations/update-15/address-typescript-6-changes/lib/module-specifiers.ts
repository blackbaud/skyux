import ts from 'typescript';

type SpecifierExtractor = (node: ts.Node) => ts.StringLiteralLike | undefined;

function getImportOrExportSpecifier(
  node: ts.Node,
): ts.StringLiteralLike | undefined {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier &&
    ts.isStringLiteralLike(node.moduleSpecifier)
  ) {
    return node.moduleSpecifier;
  }
  return undefined;
}

function getDynamicImportSpecifier(
  node: ts.Node,
): ts.StringLiteralLike | undefined {
  if (
    ts.isCallExpression(node) &&
    node.expression.kind === ts.SyntaxKind.ImportKeyword &&
    node.arguments.length > 0 &&
    ts.isStringLiteralLike(node.arguments[0])
  ) {
    return node.arguments[0];
  }
  return undefined;
}

function getImportTypeSpecifier(
  node: ts.Node,
): ts.StringLiteralLike | undefined {
  if (
    ts.isImportTypeNode(node) &&
    ts.isLiteralTypeNode(node.argument) &&
    ts.isStringLiteralLike(node.argument.literal)
  ) {
    return node.argument.literal;
  }
  return undefined;
}

function getImportEqualsSpecifier(
  node: ts.Node,
): ts.StringLiteralLike | undefined {
  if (
    ts.isExternalModuleReference(node) &&
    ts.isStringLiteralLike(node.expression)
  ) {
    return node.expression;
  }
  return undefined;
}

const SPECIFIER_EXTRACTORS: SpecifierExtractor[] = [
  getImportOrExportSpecifier,
  getDynamicImportSpecifier,
  getImportTypeSpecifier,
  getImportEqualsSpecifier,
];

export function findModuleSpecifiers(
  sourceFile: ts.SourceFile,
): ts.StringLiteralLike[] {
  const specifiers: ts.StringLiteralLike[] = [];

  function visit(node: ts.Node): void {
    for (const extract of SPECIFIER_EXTRACTORS) {
      const specifier = extract(node);
      if (specifier) {
        specifiers.push(specifier);
        break;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return specifiers;
}

/**
 * Mirrors TypeScript's own `paths` pattern matching: a pattern with no `*`
 * matches only an identical specifier, and a pattern with one `*` matches any
 * specifier long enough to contain both its prefix and suffix.
 */
export function matchesPathsPattern(
  specifier: string,
  patterns: string[],
): boolean {
  return patterns.some((pattern) => {
    const starIndex = pattern.indexOf('*');
    if (starIndex === -1) {
      return specifier === pattern;
    }

    const prefix = pattern.slice(0, starIndex);
    const suffix = pattern.slice(starIndex + 1);

    return (
      specifier.length >= prefix.length + suffix.length &&
      specifier.startsWith(prefix) &&
      specifier.endsWith(suffix)
    );
  });
}
