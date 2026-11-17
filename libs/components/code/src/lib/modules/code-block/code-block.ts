import {
  Component,
  ElementRef,
  ViewEncapsulation,
  afterEveryRender,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SkyAppWindowRef, SkyLiveAnnouncerService } from '@skyux/core';
import { SkyButton } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { firstValueFrom } from 'rxjs';

import { SkyCodeResourcesModule } from '../shared/sky-code-resources.module';

import { highlightCodeBlock } from './code-block-languages';

// Converts tabs to 2 spaces, removes trailing whitespace, leading and trailing
// blank lines, and the indentation common to every line.
function normalizeCode(code: string): string {
  const lines = code
    .replace(/\t/g, '  ')
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/^\n+|\n+$/g, '')
    .split('\n');
  const indent = Math.min(
    ...lines
      .filter((line) => line)
      .map((line) => line.length - line.trimStart().length),
  );

  return lines.map((line) => line.slice(indent)).join('\n');
}

/**
 * Displays a block of formatted code with syntax highlighting, an optional
 * file name, and a button to copy the code.
 * @preview
 */
@Component({
  selector: 'sky-code-block',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  // The highlighted code is inserted with innerHTML, so its elements never get
  // Angular's emulated-encapsulation attribute. Styles are scoped by the
  // `sky-code-block` class instead.
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-code-block',
  },
  imports: [SkyButton, SkyCodeResourcesModule],
})
export class SkyCodeBlock {
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resources = inject(SkyLibResourcesService);
  readonly #sanitizer = inject(DomSanitizer);
  readonly #windowRef = inject(SkyAppWindowRef);

  /**
   * The code to display. When not set or empty, the text content of the
   * component is displayed instead.
   */
  public readonly code = input<string>();

  /**
   * The name of the file that contains the code, displayed in the header.
   */
  public readonly fileName = input<string>();

  /**
   * Whether to hide the button that copies the code.
   */
  public readonly hideCopyToClipboard = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to hide the header, which displays the file name, the language
   * name, and the button that copies the code.
   */
  public readonly hideHeader = input(false, { transform: booleanAttribute });

  /**
   * The highlight.js name of the code's language, such as `typescript`,
   * `json`, or `xml`. Aliases such as `ts` aren't supported. When not set, or
   * not supported, the code is highlighted as XML and no language name is
   * displayed.
   */
  public readonly languageType = input<string>();

  protected readonly source = computed(() =>
    normalizeCode(this.code() || this.#projectedCode()),
  );

  protected readonly highlighted = computed(() => {
    const { displayName, html } = highlightCodeBlock(
      this.source(),
      this.languageType(),
    );

    return {
      displayName,
      // highlight.js escapes the code before wrapping tokens in spans.
      html: this.#sanitizer.bypassSecurityTrustHtml(html),
    };
  });

  protected readonly languageName = computed(
    () => this.highlighted().displayName,
  );

  protected readonly showHeader = computed(
    () =>
      !this.hideHeader() &&
      (!!this.fileName() ||
        !!this.languageName() ||
        !this.hideCopyToClipboard()),
  );

  protected readonly input =
    viewChild.required<ElementRef<HTMLElement>>('input');
  readonly #projectedCode = signal('');

  constructor() {
    // Projected text can change after the first render (for example, when it's
    // loaded asynchronously). Setting the same text again is a no-op.
    afterEveryRender(() => {
      this.#projectedCode.set(this.input().nativeElement.textContent);
    });
  }

  protected async copyCode(): Promise<void> {
    await this.#windowRef.nativeWindow.navigator.clipboard.writeText(
      this.source(),
    );

    this.#liveAnnouncer.announce(
      await firstValueFrom(
        this.#resources.getString('skyux_code_block_copy_success'),
      ),
    );
  }
}
