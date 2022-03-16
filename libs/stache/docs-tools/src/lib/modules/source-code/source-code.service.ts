import { Injectable } from '@angular/core';

import { SkyDocsSourceCodeFile } from './source-code-file';
import { SkyDocsSourceCodeProvider } from './source-code-provider';

@Injectable({
  providedIn: 'any',
})
export class SkyDocsSourceCodeService {
  constructor(private sourceCodeProvider: SkyDocsSourceCodeProvider) {}

  public getSourceCode(path: string): SkyDocsSourceCodeFile[] {
    const sourceCode = this.sourceCodeProvider.sourceCode;
    if (!sourceCode || !sourceCode.length) {
      return [];
    }

    return sourceCode
      .filter((file) => file.filePath.indexOf(path) === 0)
      .map((file) => {
        // TODO: Remove decoding after migrating to Angular CLI. Code examples will not be encoded for SKY UX 5 libraries.
        // SKY UX 4 libraries will return rawContents encoded, while later libraries will
        // return rawContents decoded. Check if the contents need decoded before returning them.
        let decodedContents: string;
        try {
          decodedContents = decodeURIComponent(file.rawContents);
          if (decodedContents !== file.rawContents) {
            file.rawContents = decodedContents;
          }
        } catch (error) {
          // Pre-decoded contents may contain characters like '%' that would throw errors.
          // In these cases, pass along the original rawContents.
        }
        return file;
      });
  }
}
