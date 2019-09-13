import {
  Injectable
} from '@angular/core';

@Injectable()
export class SkyDocsTypeDefinitionsProvider {

  public readonly anchorIds: {[_: string]: string};

  public readonly typeDefinitions: any[];

}
