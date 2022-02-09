import { Injectable } from '@angular/core';

import { TypeDocEntry } from './typedoc-types';

@Injectable()
export class SkyDocsTypeDefinitionsProvider {
  public readonly anchorIds: { [_: string]: string };

  public readonly typeDefinitions: TypeDocEntry[];
}
