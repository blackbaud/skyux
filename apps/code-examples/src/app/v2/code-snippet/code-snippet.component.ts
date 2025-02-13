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

import { type SkyCodeSnippetLanguage } from './code-snippet-language';

highlight.registerLanguage('html', hlXml);
highlight.registerLanguage('js', hlJavascript);
highlight.registerLanguage('scss', hlScss);
highlight.registerLanguage('ts', hlTypescript);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [SkyIconModule],
  selector: 'sky-code-snippet',
  styles: `
    sky-code-snippet {
      display: block;

      .sky-code-snippet-controls {
        float: right;
        margin-left: 12px;
      }

      .sky-code-snippet-pre {
        font-family: 'Roboto Mono', serif;
        margin: 0;
        line-height: var(--modern-line_height-150);
      }

      .hljs-attribute,
      .hljs-doctag,
      .hljs-keyword,
      .hljs-literal,
      .hljs-name,
      .hljs-tag .hljs-string,
      .hljs-type {
        color: #0000ff;
      }

      .hljs-string {
        color: #a31515;
      }

      .hljs-comment {
        color: #008000;
      }

      .hljs-tag .hljs-name {
        color: #800000;
      }

      .hljs-tag .hljs-attr {
        color: #e50000;
      }
    }
  `,
  template: `<div class="sky-code-snippet-controls">
      @let clipboardLabel = 'Copy code to clipboard';
      <button
        class="sky-btn sky-btn-icon-borderless"
        type="button"
        [attr.aria-label]="clipboardLabel"
        [attr.title]="clipboardLabel"
        (click)="onClipboardButtonClick()"
      >
        <sky-icon iconName="clipboard-multiple" />
      </button>
    </div>
    <pre
      #codeRef
      class="sky-code-snippet-pre"
    ><code [innerHTML]="formatted()"></code></pre> `,
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
