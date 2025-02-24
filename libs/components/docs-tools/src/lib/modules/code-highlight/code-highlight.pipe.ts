import { Pipe, PipeTransform, inject } from '@angular/core';

import { SkyCodeHighlightLanguage } from './code-highlight-language';
import { SkyCodeHighlightService } from './code-highlight.service';

@Pipe({
  name: 'skyCodeHighlight',
})
export class SkyCodeHighlightPipe implements PipeTransform {
  readonly #highlightSvc = inject(SkyCodeHighlightService);

  public transform(value: string, language: SkyCodeHighlightLanguage): string {
    return this.#highlightSvc.highlight(value, language);
  }
}
