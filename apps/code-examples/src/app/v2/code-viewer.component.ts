import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import highlight from 'highlight.js/lib/core';
import hlJavascript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypescript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

export const CODE_VIEWER_LANGUAGES = ['html', 'js', 'scss', 'ts'] as const;

export type CodeViewerLanguage = (typeof CODE_VIEWER_LANGUAGES)[number];

export function assertCodeViewerLanguage(
  value: string | undefined,
): asserts value is CodeViewerLanguage {
  if (!CODE_VIEWER_LANGUAGES.includes(value as CodeViewerLanguage)) {
    throw new Error(`Value "${value}" is not a supported language type.`);
  }
}

highlight.registerLanguage('html', hlXml);
highlight.registerLanguage('js', hlJavascript);
highlight.registerLanguage('scss', hlScss);
highlight.registerLanguage('ts', hlTypescript);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [],
  selector: 'sky-code-viewer',
  styleUrl: './code-viewer.component.scss',
  template: `<pre
    class="sky-code-viewer-pre"
  ><code [innerHTML]="formatted()"></code></pre>`,
})
export class CodeViewerComponent {
  readonly #sanitizer = inject(DomSanitizer);

  public code = input.required<string>();
  public language = input.required<CodeViewerLanguage>();

  protected formatted = computed(() => {
    const code = this.code();
    const language = this.language();
    const formatted = highlight.highlight(code, {
      language,
    });

    return this.#sanitizer.bypassSecurityTrustHtml(formatted.value);
  });
}
