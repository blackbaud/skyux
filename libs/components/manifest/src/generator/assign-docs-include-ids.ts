import fsPromises from 'node:fs/promises';
import * as ts from 'typescript';

import { type PackagesMap } from './get-public-api';

/**
 * Assign `docsIncludeIds` for each entry-point module, based on the types
 * included in its `exports` array.
 */
export async function assignDocsIncludeIds(
  packages: PackagesMap,
): Promise<void> {
  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      if (
        definition.kind !== 'module' ||
        definition.docsIncludeIds ||
        definition.isInternal
      ) {
        continue;
      }

      const contents = await fsPromises.readFile(definition.filePath, 'utf-8');

      const sourceFile = ts.createSourceFile(
        definition.filePath,
        contents,
        ts.ScriptTarget.Latest,
      );

      let moduleExports: string[] = [];

      // Get the exports from the module.
      ts.forEachChild(sourceFile, (node) => {
        if (
          ts.isClassDeclaration(node) &&
          node.name?.escapedText === definition.name
        ) {
          ts.getDecorators(node)?.[0].expression.forEachChild((child) => {
            if (ts.isObjectLiteralExpression(child)) {
              child.properties.forEach((property) => {
                if (
                  ts.isPropertyAssignment(property) &&
                  ts.isIdentifier(property.name) &&
                  property.name.escapedText === 'exports' &&
                  ts.isArrayLiteralExpression(property.initializer)
                ) {
                  property.initializer.elements.forEach((element) => {
                    if (ts.isIdentifier(element)) {
                      const exportName = element.escapedText.toString();

                      if (
                        exportName.startsWith('Sky') &&
                        definitions.some(
                          (definition) => definition.name === exportName,
                        )
                      ) {
                        moduleExports.push(element.escapedText.toString());
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });

      moduleExports = moduleExports.map((exportName) => {
        // Map the export name to its corresponding docsId.
        const definition = definitions.find(
          (definition) => definition.name === exportName,
        );

        /* istanbul ignore next: safety check */
        if (!definition?.docsId) {
          throw new Error(`Missing @docsId for ${exportName}.`);
        }

        return definition.docsId;
      });

      definition.docsIncludeIds = moduleExports;
    }
  }
}
