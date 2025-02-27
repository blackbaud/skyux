import { NgClass } from '@angular/common';
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
    '[class]': 'hostClasses()',
  },
  imports: [
    NgClass,
    SkyClipboardModule,
    SkyIconModule,
    SkyDocsToolsResourcesModule,
  ],
  selector: 'sky-code-snippet',
  styleUrls: [
    './code-snippet.component.scss',
    './themes/vscode-modern-light.scss',
  ],
  templateUrl: './code-snippet.component.html',
})
export class SkyCodeSnippetComponent {
  readonly #highlightSvc = inject(SkyCodeHighlightService);
  readonly #sanitizer = inject(DomSanitizer);

  public readonly bordered = input(false, { transform: booleanAttribute });
  public readonly code = input<string | undefined>();
  public readonly hideToolbar = input(false, { transform: booleanAttribute });
  public readonly language = input<SkyCodeHighlightLanguage | undefined>();
  public readonly stacked = input(false, { transform: booleanAttribute });

  protected readonly codeRef = viewChild<ElementRef>('codeRef');

  protected hostClasses = computed(() => {
    const stacked = this.stacked();
    const bordered = this.bordered();
    const classnames: string[] = [];

    if (stacked) {
      classnames.push('sky-margin-stacked-lg');
    }

    if (bordered) {
      classnames.push(
        'sky-elevation-0-bordered',
        'sky-padding-even-md',
        'sky-rounded-corners',
      );
    }

    return classnames.join(' ');
  });

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
