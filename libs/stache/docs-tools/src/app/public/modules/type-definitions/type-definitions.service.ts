import {
  Injectable
} from '@angular/core';

import {
  SkyDocsTypeDefinitionsProvider
} from './type-definitions-provider';

@Injectable()
export class SkyDocsTypeDefinitionsService {

  constructor(
    private typeDefinitionsProvider: SkyDocsTypeDefinitionsProvider
  ) { }

  /**
   * Returns type definitions from a specific source code location.
   * @param sourceCodeLocation The directory of the source code you wish to pull type definitions from,
   * relative to the application's root directory.
   */
  public getTypeDefinitions(sourceCodeLocation: string): any[] {
    const types: any = this.typeDefinitionsProvider.typeDefinitions;

    const requestedDir = sourceCodeLocation.replace(
      /src(\/|\\)app(\/|\\)public(\/|\\)/,
      ''
    );

    // Only process types that match the requested source code location.
    return types.children.filter((item: any) => {
      const fileName = item.sources[0].fileName;
      return (fileName.match(requestedDir));
    });
  }
}
