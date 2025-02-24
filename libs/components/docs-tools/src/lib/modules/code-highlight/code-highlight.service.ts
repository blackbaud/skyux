import { Injectable } from '@angular/core';

import highlight from 'highlight.js/lib/core';
import hlJavaScript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypeScript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { SkyCodeHighlightLanguage } from './code-highlight-language';

@Injectable({ providedIn: 'root' })
export class SkyCodeHighlightService {
  constructor() {
    highlight.registerLanguage('html', hlXml);
    highlight.registerLanguage('markup', hlXml);
    highlight.registerLanguage('js', hlJavaScript);
    highlight.registerLanguage('javascript', hlJavaScript);
    highlight.registerLanguage('css', hlScss);
    highlight.registerLanguage('scss', hlScss);
    highlight.registerLanguage('ts', hlTypeScript);
    highlight.registerLanguage('typescript', hlTypeScript);
  }

  public highlight(code: string, language: SkyCodeHighlightLanguage): string {
    const highlighted = highlight.highlight(code, {
      language,
    });

    return highlighted.value;
  }
}
