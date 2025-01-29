import fsPromises from 'node:fs/promises';
import * as ts from 'typescript';

import { SkyManifestParentDefinition } from '../types/base-def';

import { type PackagesMap } from './get-public-api';

const stuff: Record<string, SkyManifestParentDefinition[]> = {};

/**
 * Assign `docsIncludeIds` for each entry-point module, based on the types
 * included in its `exports` array.
 */
export async function assignDocsIncludeIds(
  packages: PackagesMap,
): Promise<void> {
  for (const [, definitions] of packages) {
    for (const definition of definitions) {
      // const packageName = definition.filePath.split('libs/components/')[1].split('/')[0];
      let section = definition.filePath
        .split('/src/lib/modules/')[1]
        ?.split('/')[0];

      if (!section) {
        section = definition.filePath
          .split('/testing/')[1]
          ?.split('src/modules/')[1]
          ?.split('/')[0];

        if (section) {
          section += '-testing';
        }
      }

      if (section) {
        stuff[section] ??= [];

        if (!definition.isInternal) {
          stuff[section].push(definition);
          (definition as any).section = section;
        }
      }

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

      if (!section) {
        await fsPromises.writeFile(
          definition.filePath,
          contents.replace(
            '@NgModule({',
            `throw new Error('Missing section for ${definition.filePath}');
      /**
       * @docsIncludeIds ${moduleExports.join(', ')}
       */
      @NgModule({`,
          ),
        );
      }

      definition.docsIncludeIds = moduleExports;
    }
  }

  // console.log('STUFF', stuff);

  for (const [section, definitions] of Object.entries(stuff)) {
    const module = definitions.find((d) => d.kind === 'module');

    if (module) {
      const types = stuff[section]
        .map((d) => d.docsId)
        .filter((n) => n !== module.docsId)
        .concat(stuff[`${section}-testing`]?.map((d) => d.docsId))
        .filter((n) => n);

      const contents = await fsPromises.readFile(module.filePath, 'utf-8');

      await fsPromises.writeFile(
        module.filePath,
        contents.replace(
          '@NgModule({',
          `
/**
 * @docsIncludeIds ${types.join(', ')}
 */
@NgModule({`,
        ),
      );
    }
  }
}
