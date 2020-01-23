import {
  Injectable
} from '@angular/core';

import {
  SkyDocsSourceCodeFile
} from './source-code-file';

import {
  SkyDocsSourceCodeProvider
} from './source-code-provider';

@Injectable()
export class SkyDocsSourceCodeService {

  constructor(
    private sourceCodeProvider: SkyDocsSourceCodeProvider
  ) { }

  public getSourceCode(path: string): SkyDocsSourceCodeFile[] {
    const sourceCode = this.sourceCodeProvider.sourceCode;
    if (!sourceCode || !sourceCode.length) {
      return [];
    }

    return sourceCode
      .filter(file => file.filePath.indexOf(path) === 0)
      .map(file => {
        file.rawContents = decodeURIComponent(file.rawContents);
        return file;
      });
  }

}
