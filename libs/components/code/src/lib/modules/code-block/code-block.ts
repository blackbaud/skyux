import {
  AfterContentChecked,
  Component,
  ElementRef,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SkyAppWindowRef, SkyLiveAnnouncerService } from '@skyux/core';
import { SkyButton } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { firstValueFrom } from 'rxjs';

import { SkyCodeResourcesModule } from '../shared/sky-code-resources.module';

import { SkyCodeBlockLanguageType } from './code-block-language-type';
import { highlightCodeBlock } from './code-block-languages';

// Removes leading and trailing blank lines and the indentation common to every
// line. Other whitespace is kept so copied code matches the original (for
// example, tabs in a Makefile or trailing spaces in Markdown).
function normalizeCode(code: string): string {
  const lines = code
    .split(/\r?\n/)
    .map((line) => (line.trim() ? line : ''))
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
  styleUrls: ['./code-block.scss', './themes/syntax.scss'],
  // The highlighted code is inserted with innerHTML, so its elements never get
  // Angular's emulated-encapsulation attribute. Styles are scoped by the
  // `sky-code-block` class instead.
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sky-code-block',
  },
  imports: [SkyButton, SkyCodeResourcesModule],
})
export class SkyCodeBlock implements AfterContentChecked {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resources = inject(SkyLibResourcesService);
  readonly #sanitizer = inject(DomSanitizer);
  readonly #windowRef = inject(SkyAppWindowRef);

  /**
   * The code to display. Bind this input to a property in your component when
   * the code spans multiple lines or contains characters that Angular templates
   * treat specially. When not set or empty, the text content of the component
   * is displayed instead.
   */
  public readonly code = input<string>();

  /**
   * The name of the file that contains the code, displayed in the header.
   */
  public readonly fileName = input<string>();

  /**
   * Whether to hide the button that copies the code.
   * @default false
   */
  public readonly hideCopyToClipboard = input(false, {
    transform: booleanAttribute,
  });

  /**
   * Whether to hide the header, which displays the file name, the language
   * name, and the button that copies the code.
   * @default false
   */
  public readonly hideHeader = input(false, { transform: booleanAttribute });

  /**
   * The language of the code, which determines its syntax highlighting and the
   * language name in the header.
   */
  public readonly languageType = input.required<SkyCodeBlockLanguageType>();

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

  readonly #projectedCode = signal('');

  public ngAfterContentChecked(): void {
    // Projected text is read before this component's view renders, so it's
    // displayed on the first render, including on the server. Setting the same
    // text again is a no-op.
    if (!this.code()) {
      this.#projectedCode.set(
        (
          this.#elementRef.nativeElement.querySelector(
            ':scope > .sky-code-block-input',
          ) as HTMLElement
        ).textContent,
      );
    }
  }

  protected async copyCode(): Promise<void> {
    try {
      await this.#windowRef.nativeWindow.navigator.clipboard.writeText(
        this.source(),
      );
    } catch {
      // The clipboard is unavailable (for example, on an insecure origin) or
      // the browser denied access, so nothing was copied.
      return;
    }

    this.#liveAnnouncer.announce(
      await firstValueFrom(
        this.#resources.getString('skyux_code_block_copy_success'),
      ),
    );
  }
}
