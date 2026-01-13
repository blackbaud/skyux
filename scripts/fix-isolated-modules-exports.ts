#!/usr/bin/env ts-node
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { dirname, join } from 'path';
import ts from 'typescript';

interface ExportInfo {
  lineNumber: number;
  originalText: string;
  names: string[];
  isTypeOnly: boolean;
  moduleSpecifier: string;
  startPos: number;
  endPos: number;
}

/**
 * Parse exports from a source file
 */
function parseExports(sourceFile: ts.SourceFile): ExportInfo[] {
  const exports: ExportInfo[] = [];

  function visit(node: ts.Node) {
    if (ts.isExportDeclaration(node)) {
      const exportClause = node.exportClause;
      if (
        exportClause &&
        ts.isNamedExports(exportClause) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const names = exportClause.elements.map((el) => el.name.text);
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        const text = node.getText(sourceFile);

        exports.push({
          lineNumber: line,
          originalText: text,
          names,
          isTypeOnly: node.isTypeOnly || false,
          moduleSpecifier: node.moduleSpecifier.text,
          startPos: node.getStart(sourceFile),
          endPos: node.getEnd(),
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

/**
 * Resolve a module path to an absolute file path
 */
function resolveModulePath(
  baseDir: string,
  moduleSpecifier: string,
): string | null {
  if (!moduleSpecifier.startsWith('.')) {
    return null; // External module
  }

  const possibleExtensions = ['.ts', '/index.ts', '.tsx', '/index.tsx'];
  const basePath = join(baseDir, moduleSpecifier);

  for (const ext of possibleExtensions) {
    const fullPath = basePath + ext;
    try {
      readFileSync(fullPath, 'utf-8');
      return fullPath;
    } catch {
      // Try next extension
    }
  }

  return null;
}

/**
 * Check if a name is a type by analyzing the source file
 */
function isTypeName(name: string, sourceFile: ts.SourceFile): boolean {
  let isType = false;

  function visit(node: ts.Node) {
    // Check for type declarations
    if (ts.isInterfaceDeclaration(node)) {
      if (node.name.text === name) {
        isType = true;
      }
    } else if (ts.isTypeAliasDeclaration(node)) {
      if (node.name.text === name) {
        isType = true;
      }
    } else if (ts.isEnumDeclaration(node)) {
      // Enums can be used as both types and values, treat as value
      if (node.name.text === name) {
        isType = false;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return isType;
}

/**
 * Categorize export names as types or values
 */
function categorizeExportNames(
  names: string[],
  moduleSpecifier: string,
  baseDir: string,
): { typeNames: string[]; valueNames: string[] } {
  const typeNames: string[] = [];
  const valueNames: string[] = [];

  // Resolve the module
  const modulePath = resolveModulePath(baseDir, moduleSpecifier);
  if (!modulePath) {
    // Can't resolve, assume all are values
    return { typeNames: [], valueNames: names };
  }

  // Parse the source file
  let content: string;
  try {
    content = readFileSync(modulePath, 'utf-8');
  } catch {
    // Can't read, assume all are values
    return { typeNames: [], valueNames: names };
  }

  const sourceFile = ts.createSourceFile(
    modulePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  // Check each name
  for (const name of names) {
    if (isTypeName(name, sourceFile)) {
      typeNames.push(name);
    } else {
      valueNames.push(name);
    }
  }

  return { typeNames, valueNames };
}

/**
 * Fix exports in a file
 */
function fixFile(filePath: string): boolean {
  console.log(`\nProcessing: ${filePath.replace(process.cwd() + '/', '')}`);

  const content = readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
  );

  const exports = parseExports(sourceFile);

  if (exports.length === 0) {
    console.log('  No exports found');
    return false;
  }

  const baseDir = dirname(filePath);
  let modified = false;
  const replacements: Array<{
    start: number;
    end: number;
    newText: string;
  }> = [];

  for (const exp of exports) {
    // Skip if already type-only
    if (exp.isTypeOnly) {
      continue;
    }

    // Categorize the export names
    const { typeNames, valueNames } = categorizeExportNames(
      exp.names,
      exp.moduleSpecifier,
      baseDir,
    );

    // If we have type names, we need to split the export
    if (typeNames.length > 0) {
      modified = true;
      const newLines: string[] = [];

      // Create type export
      newLines.push(
        `export type { ${typeNames.join(', ')} } from '${exp.moduleSpecifier}';`,
      );

      // Create value export if needed
      if (valueNames.length > 0) {
        newLines.push(
          `export { ${valueNames.join(', ')} } from '${exp.moduleSpecifier}';`,
        );
      }

      replacements.push({
        start: exp.startPos,
        end: exp.endPos,
        newText: newLines.join('\n'),
      });

      console.log(`  Line ${exp.lineNumber + 1}:`);
      console.log(`    Types: ${typeNames.join(', ')}`);
      if (valueNames.length > 0) {
        console.log(`    Values: ${valueNames.join(', ')}`);
      }
    }
  }

  if (modified) {
    // Apply replacements in reverse order to maintain positions
    let newContent = content;
    replacements.reverse().forEach((replacement) => {
      newContent =
        newContent.substring(0, replacement.start) +
        replacement.newText +
        newContent.substring(replacement.end);
    });

    writeFileSync(filePath, newContent, 'utf-8');
    console.log('  ✓ Fixed');
    return true;
  } else {
    console.log('  No changes needed');
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Fix isolatedModules Type Re-export Errors');
  console.log('='.repeat(60));
  console.log('\nFinding files...');

  // Find all matching files
  const indexFiles = await glob('libs/**/index.ts', {
    cwd: process.cwd(),
    absolute: true,
  });
  const publicApiFiles = await glob('libs/**/public-api.ts', {
    cwd: process.cwd(),
    absolute: true,
  });
  const allFiles = [...indexFiles, ...publicApiFiles].sort();

  console.log(`Found ${allFiles.length} files to process`);

  let fixedCount = 0;
  for (const file of allFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));
  console.log(`Total files:    ${allFiles.length}`);
  console.log(`Fixed:          ${fixedCount}`);
  console.log(`Unchanged:      ${allFiles.length - fixedCount}`);
  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('\nError:', error);
  process.exit(1);
});
