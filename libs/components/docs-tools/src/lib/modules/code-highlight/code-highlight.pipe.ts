import { Pipe, PipeTransform, inject } from '@angular/core';

import { SkyDocsCodeHighlightLanguage } from './code-highlight-language';
import { SkyDocsCodeHighlightService } from './code-highlight.service';

/**
 * @internal
 */
@Pipe({
  name: 'skyDocsCodeHighlight',
})
export class SkyDocsCodeHighlightPipe implements PipeTransform {
  readonly #highlightSvc = inject(SkyDocsCodeHighlightService);

  public transform(
    value: string,
    language: SkyDocsCodeHighlightLanguage,
  ): string {
    return this.#highlightSvc.highlight(value, language);
  }
}
