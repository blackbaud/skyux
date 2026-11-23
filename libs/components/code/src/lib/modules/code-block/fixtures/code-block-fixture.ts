import { Component, signal } from '@angular/core';

import { SkyCodeBlock } from '../code-block';
import { SkyCodeBlockLanguageType } from '../code-block-language-type';

@Component({
  selector: 'sky-code-block-test',
  imports: [SkyCodeBlock],
  template: `
    <sky-code-block
      data-sky-id="code-block"
      [code]="code()"
      [fileName]="fileName()"
      [hideCopyToClipboard]="hideCopyToClipboard()"
      [hideHeader]="hideHeader()"
      [languageType]="languageType()"
      >{{ projected() }}</sky-code-block
    >
  `,
})
export class CodeBlockFixture {
  public readonly code = signal<string | undefined>(undefined);
  public readonly fileName = signal<string | undefined>(undefined);
  public readonly hideCopyToClipboard = signal(false);
  public readonly hideHeader = signal(false);
  public readonly languageType = signal<SkyCodeBlockLanguageType>('xml');
  public readonly projected = signal<string | undefined>(undefined);
}
