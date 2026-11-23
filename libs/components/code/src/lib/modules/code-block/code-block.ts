import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import {
  SkyAppWindowRef,
  SkyLiveAnnouncerService,
  SkyMutationObserverService,
} from '@skyux/core';
import { SkyButton } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { firstValueFrom } from 'rxjs';

import { SkyCodeResourcesModule } from '../shared/sky-code-resources.module';

import { SkyCodeBlockLanguageType } from './code-block-language-type';
import { highlightCodeBlock } from './code-block-languages';
import { SkyCodeBlockOutput } from './code-block-output';

// Language names are proper nouns that stay the same in every locale, so only
// "Plain text" comes from the resource strings. highlight.js names a few
// languages awkwardly ("php", "HTML, XML", "Batch file (DOS)"), so each language
// type gets its own name.
const LANGUAGE_NAMES: Record<
  Exclude<SkyCodeBlockLanguageType, 'plaintext'>,
  string
> = {
  arduino: 'Arduino',
  asciidoc: 'AsciiDoc',
  bash: 'Bash',
  csharp: 'C#',
  css: 'CSS',
  dos: 'Batch',
  gherkin: 'Gherkin',
  html: 'HTML',
  http: 'HTTP',
  java: 'Java',
  javascript: 'JavaScript',
  json: 'JSON',
  markdown: 'Markdown',
  php: 'PHP',
  powershell: 'PowerShell',
  python: 'Python',
  sql: 'SQL',
  typescript: 'TypeScript',
  xml: 'XML',
  yaml: 'YAML',
};

// Removes leading and trailing blank lines and the leading spaces and tabs
// common to every line. Other whitespace is kept so copied code matches the
// original (for example, tabs in a Makefile or trailing spaces in Markdown).
// Only spaces and tabs count as indentation, so characters such as
// non-breaking spaces are kept.
function normalizeCode(code: string): string {
  const lines = code.split(/\r?\n/);
  const isBlank = (line: string): boolean => /^[ \t]*$/.test(line);

  while (lines.length && isBlank(lines[0])) {
    lines.shift();
  }

  while (lines.length && isBlank(lines[lines.length - 1])) {
    lines.pop();
  }

  const indents = lines
    .filter((line) => !isBlank(line))
    .map((line) => line.slice(0, line.search(/[^ \t]/)));

  // Comparing whitespace characters, not widths, keeps a mix of tabs and spaces
  // from losing uneven amounts of indentation.
  let indent = indents[0] ?? '';

  for (const lineIndent of indents) {
    while (!lineIndent.startsWith(indent)) {
      indent = indent.slice(0, -1);
    }
  }

  return lines.map((line) => line.slice(indent.length)).join('\n');
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
  imports: [SkyButton, SkyCodeBlockOutput, SkyCodeResourcesModule],
})
export class SkyCodeBlock implements AfterViewInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #mutationObserver = inject(SkyMutationObserverService);
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
    const { html, languageType } = highlightCodeBlock(
      this.source(),
      this.languageType(),
    );

    return {
      // highlight.js escapes the code before wrapping tokens in spans.
      html: this.#sanitizer.bypassSecurityTrustHtml(html),
      languageType,
    };
  });

  readonly #plainTextLabel = toSignal(
    this.#resources.getString('skyux_code_block_plain_text'),
  );

  protected readonly languageName = computed(() => {
    const languageType = this.highlighted().languageType;

    if (languageType === 'plaintext') {
      return this.#plainTextLabel();
    }

    return languageType && LANGUAGE_NAMES[languageType];
  });

  protected readonly showHeader = computed(
    () =>
      !this.hideHeader() &&
      (!!this.fileName() ||
        !!this.languageName() ||
        !this.hideCopyToClipboard()),
  );

  readonly #projectedCode = signal('');

  public ngAfterViewInit(): void {
    // The projected nodes stay hidden while a highlighted copy of their text is
    // displayed, so the copy is updated whenever the text changes. Reading it
    // here, after projected components render, also covers server rendering.
    const input = this.#elementRef.nativeElement.querySelector(
      ':scope > .sky-code-block-input',
    ) as HTMLElement;
    const readProjectedCode = (): void =>
      this.#projectedCode.set(input.textContent);

    readProjectedCode();

    const observer = this.#mutationObserver.create(readProjectedCode);

    observer.observe(input, {
      characterData: true,
      childList: true,
      subtree: true,
    });
    this.#destroyRef.onDestroy(() => observer.disconnect());
  }

  protected async copyCode(): Promise<void> {
    let resourceKey = 'skyux_code_block_copy_success';

    try {
      await this.#windowRef.nativeWindow.navigator.clipboard.writeText(
        this.source(),
      );
    } catch {
      // The clipboard is unavailable (for example, on an insecure origin) or
      // the browser denied access.
      resourceKey = 'skyux_code_block_copy_failure';
    }

    this.#liveAnnouncer.announce(
      await firstValueFrom(this.#resources.getString(resourceKey)),
    );
  }
}
