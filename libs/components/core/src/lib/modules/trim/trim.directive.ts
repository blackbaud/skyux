import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

import { SkyMutationObserverService } from '../mutation/mutation-observer-service';

/**
 * Trims whitespace in each text node that is a direct descendent of the current element.
 */
@Directive({
  selector: '[skyTrim]',
  standalone: false,
})
export class SkyTrimDirective implements OnInit, OnDestroy {
  #el: Element;

  #obs: MutationObserver;

  constructor(elRef: ElementRef, mutationObs: SkyMutationObserverService) {
    this.#el = elRef.nativeElement as Element;

    this.#obs = mutationObs.create((mutations) => {
      if (
        mutations.some(
          (mutation) =>
            mutation.target === this.#el.firstChild ||
            mutation.target === this.#el.lastChild,
        )
      ) {
        this.#trimNodes();
      }
    });

    this.#observe();
  }

  public ngOnInit(): void {
    this.#trimNodes();
  }

  public ngOnDestroy(): void {
    this.#disconnect();
  }

  #observe(): void {
    this.#obs.observe(this.#el, {
      characterData: true,
      subtree: true,
    });
  }

  #disconnect(): void {
    this.#obs.disconnect();
  }

  #trimNodes(): void {
    const el = this.#el;

    if (el.hasChildNodes()) {
      // Suspend the MutationObserver so altering the text content of each node
      // doesn't retrigger the observe callback.
      this.#disconnect();

      if (el.firstChild === el.lastChild) {
        this.#trimNode(el.firstChild, 'trim');
      } else {
        this.#trimNode(el.firstChild, 'trimStart');
        this.#trimNode(el.lastChild, 'trimEnd');
      }

      this.#observe();
    }
  }

  #trimNode(
    node: Node | null,
    trimMethod: 'trim' | 'trimEnd' | 'trimStart',
  ): void {
    if (node?.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent;

      if (textContent) {
        const textContentTrimmed = textContent[trimMethod]();

        if (textContent !== textContentTrimmed) {
          node.textContent = textContentTrimmed;
        }
      }
    }
  }
}
