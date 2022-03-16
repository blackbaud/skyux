import { Injectable } from '@angular/core';

import { SkyDocsTypeDefinitions } from './type-definitions';

import { SkyDocsTypeDefinitionsProvider } from './type-definitions-provider';

import { SkyDocsTypeDocAdapterService } from './typedoc-adapter.service';

/**
 * Handles all type definitions that have been converted from the third-party documentation generator.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyDocsTypeDefinitionsService {
  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider,
    private adapter: SkyDocsTypeDocAdapterService
  ) {}

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodePath The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(
    sourceCodePath: string,
    additionalSourceCodePaths?: string[]
  ): SkyDocsTypeDefinitions {
    if (!sourceCodePath) {
      throw new Error('The `sourceCodePath` parameter is required');
    }

    const sourceCodePaths: string[] =
      additionalSourceCodePaths && additionalSourceCodePaths.length > 0
        ? [sourceCodePath].concat(additionalSourceCodePaths)
        : [sourceCodePath];

    sourceCodePaths.forEach((path) => {
      if (!path.endsWith('/') && !path.endsWith('.ts')) {
        throw new Error(
          'Source code paths must end with a forward slash (`/`) or `.ts`.'
        );
      }
    });

    const allDefinitions = this.typeDefinitionsProvider.typeDefinitions;
    const types: SkyDocsTypeDefinitions = {
      classes: [],
      components: [],
      directives: [],
      enumerations: [],
      interfaces: [],
      pipes: [],
      services: [],
      typeAliases: [],
    };

    if (!allDefinitions) {
      console.warn(`No types were found for this project!`);
      return types;
    }

    sourceCodePaths.forEach((path) => {
      const requestedDir = path
        .replace(/src\/app\/public\//, '')
        .replace(/^\//, ''); // remove first slash.

      // Only process types that match the requested source code location.
      const typeDefinitions = allDefinitions.filter(
        (i) => i.sources && i.sources[0].fileName.match(requestedDir)
      );
      if (typeDefinitions.length === 0) {
        console.warn(
          `Type definitions were not found for location: ${requestedDir}`
        );
      }

      typeDefinitions.forEach((item) => {
        const decorator = item.decorators && item.decorators[0].name;
        const kindString = item.kindString;

        switch (decorator) {
          case 'Component':
            types.components.push(this.adapter.toDirectiveDefinition(item));
            break;
          case 'Directive':
            types.directives.push(this.adapter.toDirectiveDefinition(item));
            break;
          case 'Injectable':
            types.services.push(this.adapter.toClassDefinition(item));
            break;
          case 'NgModule':
            // Don't document modules.
            break;
          case 'Pipe':
            types.pipes.push(this.adapter.toPipeDefinition(item));
            break;
          default:
            /*tslint:disable-next-line:switch-default*/
            switch (kindString) {
              case 'Class':
                types.classes.push(this.adapter.toClassDefinition(item));
                break;
              case 'Interface':
                types.interfaces.push(this.adapter.toInterfaceDefinition(item));
                break;
              case 'Enumeration':
                types.enumerations.push(
                  this.adapter.toEnumerationDefinition(item)
                );
                break;
              case 'Type alias':
                types.typeAliases.push(
                  this.adapter.toTypeAliasDefinition(item)
                );
                break;
            }
        }
      });
    });

    return types;
  }
}
