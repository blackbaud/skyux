import { Injectable } from '@angular/core';

import highlight from 'highlight.js/lib/core';
import hlCss from 'highlight.js/lib/languages/css';
import hlJavaScript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypeScript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { SkyDocsCodeHighlightLanguage } from './code-highlight-language';

/**
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyDocsCodeHighlightService {
  constructor() {
    highlight.registerLanguage('html', hlXml);
    highlight.registerLanguage('markup', hlXml);
    highlight.registerLanguage('js', hlJavaScript);
    highlight.registerLanguage('javascript', hlJavaScript);
    highlight.registerLanguage('css', hlCss);
    highlight.registerLanguage('scss', hlScss);
    highlight.registerLanguage('ts', hlTypeScript);
    highlight.registerLanguage('typescript', hlTypeScript);
  }

  public highlight(
    code: string,
    language: SkyDocsCodeHighlightLanguage,
  ): string {
    const highlighted = highlight.highlight(code, {
      language,
    });

    return highlighted.value;
  }
}
