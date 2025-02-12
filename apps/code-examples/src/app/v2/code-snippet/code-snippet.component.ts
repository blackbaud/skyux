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

export const SKY_CODE_VIEWER_LANGUAGES = ['html', 'js', 'scss', 'ts'] as const;

export type SkyCodeSnippetLanguage = (typeof SKY_CODE_VIEWER_LANGUAGES)[number];

export function assertCodeSnippetLanguage(
  value: string | undefined,
): asserts value is SkyCodeSnippetLanguage {
  if (!SKY_CODE_VIEWER_LANGUAGES.includes(value as SkyCodeSnippetLanguage)) {
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
  selector: 'sky-code-snippet',
  styleUrl: './code-snippet.component.scss',
  templateUrl: './code-snippet.component.html',
})
export class SkyCodeSnippetComponent {
  readonly #sanitizer = inject(DomSanitizer);

  public readonly code = input.required<string>();
  public readonly language = input.required<SkyCodeSnippetLanguage>();

  protected formatted = computed(() => {
    const code = this.code();
    const language = this.language();
    const formatted = highlight.highlight(code, {
      language,
    });

    return this.#sanitizer.bypassSecurityTrustHtml(formatted.value);
  });
}
