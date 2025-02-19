import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SkyIconModule } from '@skyux/icon';

import highlight from 'highlight.js/lib/core';
import hlJavaScript from 'highlight.js/lib/languages/javascript';
import hlScss from 'highlight.js/lib/languages/scss';
import hlTypeScript from 'highlight.js/lib/languages/typescript';
import hlXml from 'highlight.js/lib/languages/xml';

import { SkyClipboardService } from '../clipboard/clipboard.service';
import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

import { type SkyCodeSnippetLanguage } from './code-snippet-language';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-elevation-0-bordered sky-padding-even-md',
  },
  imports: [SkyIconModule, SkyDocsToolsResourcesModule],
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
  public readonly hideToolbar = input(false, { transform: booleanAttribute });
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

  constructor() {
    highlight.registerLanguage('html', hlXml);
    highlight.registerLanguage('js', hlJavaScript);
    highlight.registerLanguage('scss', hlScss);
    highlight.registerLanguage('ts', hlTypeScript);
  }

  protected onClipboardButtonClick(copySuccessMessage: string): void {
    const el = this.codeRef();
    if (el) {
      this.#clipboardSvc.copyTextContent(el, copySuccessMessage);
    }
  }
}
