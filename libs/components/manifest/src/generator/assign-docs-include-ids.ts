import type { SkyManifestParentDefinition } from '../types/base-def';

import { type PackagesMap } from './get-public-api';

function getDefinitionByDocsId(
  docsId: string,
  packages: PackagesMap,
): SkyManifestParentDefinition | undefined {
  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      if (definition.docsId === docsId) {
        return definition;
      }
    }
  }

  return;
}

function validateDocsIds(packages: PackagesMap): string[] {
  const errors: string[] = [];
  const ids: string[] = [];

  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      if (ids.includes(definition.docsId)) {
        errors.push(`Duplicate @docsId encountered: ${definition.docsId}`);
        continue;
      }

      ids.push(definition.docsId);
    }
  }

  return errors;
}

function validateDocsIncludeIds(packages: PackagesMap): string[] {
  const errors: string[] = [];

  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      const docsIncludeIds = definition.docsIncludeIds;

      if (docsIncludeIds) {
        for (const docsId of docsIncludeIds) {
          const referencedDefinition = getDefinitionByDocsId(docsId, packages);

          if (!referencedDefinition) {
            errors.push(
              `The @docsId "${docsId}" referenced by "${definition.name}" is not recognized.`,
            );
            continue;
          }

          if (referencedDefinition.isInternal) {
            errors.push(
              `The @docsId "${docsId}" referenced by "${definition.name}" is not included in the public API.`,
            );
            continue;
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Assign `docsIncludeIds` for each entry-point module, based on the types
 * included in its `exports` array.
 */
export function assignDocsIncludeIds(packages: PackagesMap): void {
  const errors: string[] = [];

  // for (const [, definitions] of packages) {
  //   for (const definition of definitions) {
  //     if (
  //       definition.kind !== 'module' ||
  //       definition.docsIncludeIds ||
  //       definition.isInternal
  //     ) {
  //       continue;
  //     }

  //     const contents = await fsPromises.readFile(definition.filePath, 'utf-8');

  //     const sourceFile = ts.createSourceFile(
  //       definition.filePath,
  //       contents,
  //       ts.ScriptTarget.Latest,
  //     );

  //     let moduleExports: string[] = [];

  //     // Get the exports from the module.
  //     ts.forEachChild(sourceFile, (node) => {
  //       if (
  //         ts.isClassDeclaration(node) &&
  //         node.name?.escapedText === definition.name
  //       ) {
  //         ts.getDecorators(node)?.[0].expression.forEachChild((child) => {
  //           if (ts.isObjectLiteralExpression(child)) {
  //             child.properties.forEach((property) => {
  //               if (
  //                 ts.isPropertyAssignment(property) &&
  //                 ts.isIdentifier(property.name) &&
  //                 property.name.escapedText === 'exports' &&
  //                 ts.isArrayLiteralExpression(property.initializer)
  //               ) {
  //                 property.initializer.elements.forEach((element) => {
  //                   if (ts.isIdentifier(element)) {
  //                     const exportName = element.escapedText.toString();
  //                     const definition = definitions.find(
  //                       (definition) => definition.name === exportName,
  //                     );

  //                     if (
  //                       exportName.startsWith('Sky') &&
  //                       definition &&
  //                       !definition.isInternal
  //                     ) {
  //                       moduleExports.push(element.escapedText.toString());
  //                     }
  //                   }
  //                 });
  //               }
  //             });
  //           }
  //         });
  //       }
  //     });

  //     moduleExports = moduleExports.map((exportName) => {
  //       // Map the export name to its corresponding docsId.
  //       const definition = definitions.find(
  //         (definition) => definition.name === exportName,
  //       );

  //       /* istanbul ignore next: safety check */
  //       if (!definition?.docsId) {
  //         throw new Error(`Missing @docsId for ${exportName}.`);
  //       }

  //       return definition.docsId;
  //     });

  //     definition.docsIncludeIds = moduleExports;
  //   }
  // }

  errors.push(...validateDocsIds(packages));
  errors.push(...validateDocsIncludeIds(packages));

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
}
