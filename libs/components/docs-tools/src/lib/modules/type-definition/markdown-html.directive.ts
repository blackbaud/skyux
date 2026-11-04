import {
  ComponentRef,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Renderer2,
  SecurityContext,
  createComponent,
  effect,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SkyCode } from '@skyux/code';

/**
 * Renders HTML generated from markdown, replacing its inline code with
 * `sky-code` components. `[innerHTML]` can't instantiate components, so this
 * directive writes the sanitized HTML itself.
 * @internal
 */
@Directive({
  selector: '[skyDocsMarkdownHtml]',
})
export class SkyDocsMarkdownHtmlDirective {
  public readonly skyDocsMarkdownHtml = input.required<string>();

  readonly #doc = inject(DOCUMENT);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly #renderer = inject(Renderer2);
  readonly #sanitizer = inject(DomSanitizer);

  #codeRefs: ComponentRef<SkyCode>[] = [];

  constructor() {
    effect(() => {
      const html = this.#sanitizer.sanitize(
        SecurityContext.HTML,
        this.skyDocsMarkdownHtml(),
      );

      this.#destroyCodeRefs();
      this.#renderer.setProperty(this.#hostEl, 'innerHTML', html);

      this.#codeRefs = Array.from(
        this.#hostEl.querySelectorAll('code.sky-docs-codespan'),
        (inlineCode) => {
          const hostElement = this.#doc.createElement('sky-code');

          const codeRef = createComponent(SkyCode, {
            environmentInjector: this.#environmentInjector,
            hostElement,
            projectableNodes: [Array.from(inlineCode.childNodes)],
          });

          inlineCode.replaceWith(hostElement);

          return codeRef;
        },
      );
    });

    inject(DestroyRef).onDestroy(() => this.#destroyCodeRefs());
  }

  #destroyCodeRefs(): void {
    for (const codeRef of this.#codeRefs) {
      codeRef.destroy();
    }
  }
}
