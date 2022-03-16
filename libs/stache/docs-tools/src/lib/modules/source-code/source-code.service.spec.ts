import { SkyDocsSourceCodeProvider } from './source-code-provider';

import { SkyDocsSourceCodeService } from './source-code.service';

describe('Source code service', () => {
  let service: SkyDocsSourceCodeService;
  const path = 'foo/bar';

  it('getSourceCode should handle decoded rawContents', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '<baz></baz>',
        },
      ],
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual('<baz></baz>');
  });

  it('getSourceCode should handle encoded rawContents', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '%3Cbaz%3E%3C/baz%3E',
        },
      ],
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual('<baz></baz>');
  });

  it('getSourceCode should handle decoded rawContents with URI reserved characters', () => {
    const mockSourceCodeProvider: SkyDocsSourceCodeProvider = {
      sourceCode: [
        {
          fileName: 'foo',
          filePath: 'foo/bar',
          rawContents: '<baz style="width: 50%;"></baz>',
        },
      ],
    };
    service = new SkyDocsSourceCodeService(mockSourceCodeProvider);
    expect(service.getSourceCode(path)[0].rawContents).toEqual(
      '<baz style="width: 50%;"></baz>'
    );
  });
});
