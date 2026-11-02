import {
  ComponentRef,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  afterEveryRender,
  createComponent,
  inject,
} from '@angular/core';
import { SkyCodeComponent } from '@skyux/code';

/**
 * Markdown is rendered through `innerHTML`, which can't instantiate components,
 * so after each render this replaces the inline code in the host's markdown with
 * `sky-code` components. Must be called in an injection context.
 * @internal
 */
export function upgradeMarkdownInlineCode(): void {
  const doc = inject(DOCUMENT);
  const environmentInjector = inject(EnvironmentInjector);
  const hostEl = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  let codeRefs: ComponentRef<SkyCodeComponent>[] = [];

  afterEveryRender(() => {
    // Re-rendered markdown replaces the DOM of previously upgraded inline code.
    codeRefs = codeRefs.filter((codeRef) => {
      if (codeRef.location.nativeElement.isConnected) {
        return true;
      }

      codeRef.destroy();
      return false;
    });

    for (const inlineCode of hostEl.querySelectorAll(
      'code.sky-docs-codespan',
    )) {
      const hostElement = doc.createElement('sky-code');

      codeRefs.push(
        createComponent(SkyCodeComponent, {
          environmentInjector,
          hostElement,
          projectableNodes: [Array.from(inlineCode.childNodes)],
        }),
      );

      inlineCode.replaceWith(hostElement);
    }
  });

  inject(DestroyRef).onDestroy(() => {
    for (const codeRef of codeRefs) {
      codeRef.destroy();
    }
  });
}
