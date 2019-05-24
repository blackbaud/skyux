import {
  Injectable
} from '@angular/core';

import {
  SkyDocsSourceCodeFile
} from './source-code-file';

@Injectable()
export abstract class SkyDocsSourceCodeProvider {

  public getSourceCode: (path: string) => SkyDocsSourceCodeFile[];

}
