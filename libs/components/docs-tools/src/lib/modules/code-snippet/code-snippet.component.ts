import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { type SkyDocsCodeHighlightLanguage } from '../code-highlight/code-highlight-language';
import { SkyDocsCodeHighlightService } from '../code-highlight/code-highlight.service';

import { SkyDocsCodeSnippetToolbarComponent } from './code-snippet-toolbar.component';

/**
 * Highlights the provided code.
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.sky-margin-stacked-lg]': 'stacked()',
    '[class.sky-elevation-0-bordered]': 'bordered()',
    '[class.sky-padding-even-xl]': 'bordered()',
    '[class.sky-rounded-corners]': 'bordered()',
  },
  imports: [SkyDocsCodeSnippetToolbarComponent],
  selector: 'sky-docs-code-snippet[code]',
  styleUrls: [
    './code-snippet.component.scss',
    './themes/vscode-modern-light.scss',
  ],
  template: `
    @if (!hideToolbar()) {
      <sky-docs-code-snippet-toolbar [codeRef]="codeRef" />
    }
    <pre #codeRef><code [innerHTML]="highlighted()"></code></pre>
  `,
})
export class SkyDocsCodeSnippetComponent {
  readonly #highlightSvc = inject(SkyDocsCodeHighlightService);
  readonly #sanitizer = inject(DomSanitizer);

  public readonly code = input.required<string>();
  public readonly language = input.required<SkyDocsCodeHighlightLanguage>();

  public readonly bordered = input(false, { transform: booleanAttribute });
  public readonly hideToolbar = input(false, { transform: booleanAttribute });
  public readonly stacked = input(false, { transform: booleanAttribute });

  protected highlighted = computed(() => {
    const code = this.code();
    const language = this.language();
    const highlighted = this.#highlightSvc.highlight(code, language);

    return this.#sanitizer.bypassSecurityTrustHtml(highlighted);
  });
}
