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

import { SkyClipboardModule } from '../clipboard/clipboard.module';
import { type SkyCodeHighlightLanguage } from '../code-highlight/code-highlight-language';
import { SkyCodeHighlightService } from '../code-highlight/code-highlight.service';
import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-elevation-0-bordered sky-padding-even-md sky-rounded-corners',
  },
  imports: [SkyClipboardModule, SkyIconModule, SkyDocsToolsResourcesModule],
  selector: 'sky-code-snippet',
  styleUrls: [
    './code-snippet.component.scss',
    './themes/visual-studio-light.scss',
  ],
  templateUrl: './code-snippet.component.html',
})
export class SkyCodeSnippetComponent {
  readonly #highlightSvc = inject(SkyCodeHighlightService);
  readonly #sanitizer = inject(DomSanitizer);

  public readonly code = input<string | undefined>();
  public readonly hideToolbar = input(false, { transform: booleanAttribute });
  public readonly language = input<SkyCodeHighlightLanguage | undefined>();

  protected readonly codeRef = viewChild<ElementRef>('codeRef');

  protected highlighted = computed(() => {
    const code = this.code();
    const language = this.language();

    if (code && language) {
      const highlighted = this.#highlightSvc.highlight(code, language);

      return this.#sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    return undefined;
  });
}
