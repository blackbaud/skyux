import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SkyIconModule } from '@skyux/icon';

import highlight from 'highlight.js/lib/core';
import hlJavascript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypescript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { SkyClipboardService } from '../clipboard/clipboard.service';
import { SkyDocsUtilsResourcesModule } from '../shared/sky-docs-utils-resources.module';

import { type SkyCodeSnippetLanguage } from './code-snippet-language';

highlight.registerLanguage('html', hlXml);
highlight.registerLanguage('js', hlJavascript);
highlight.registerLanguage('scss', hlScss);
highlight.registerLanguage('ts', hlTypescript);

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SkyIconModule, SkyDocsUtilsResourcesModule],
  selector: 'sky-code-snippet',
  styleUrls: [
    './code-snippet.component.scss',
    './themes/visual-studio-light.scss',
  ],
  templateUrl: './code-snippet.component.html',
})
export class SkyCodeSnippetComponent {
  readonly #clipboardSvc = inject(SkyClipboardService);
  readonly #sanitizer = inject(DomSanitizer);

  public readonly code = input.required<string>();
  public readonly language = input.required<SkyCodeSnippetLanguage>();

  protected readonly codeRef = viewChild<ElementRef>('codeRef');

  protected formatted = computed(() => {
    const code = this.code();
    const language = this.language();
    const formatted = highlight.highlight(code, {
      language,
    });

    return this.#sanitizer.bypassSecurityTrustHtml(formatted.value);
  });

  protected onClipboardButtonClick(): void {
    const el = this.codeRef();
    if (el) {
      this.#clipboardSvc.copyTextContent(el, 'Code copied');
    }
  }
}
