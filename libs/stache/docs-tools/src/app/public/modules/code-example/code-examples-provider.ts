import {
  Injectable
} from '@angular/core';

import {
  SkyDocsCodeExample
} from './code-example';

@Injectable()
export class SkyDocsCodeExamplesProvider {

  public getCodeExamples(): SkyDocsCodeExample[] {
    return [];
  }

}
