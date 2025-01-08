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
  #elRef: ElementRef;

  #obs: MutationObserver;

  constructor(elRef: ElementRef, mutationObs: SkyMutationObserverService) {
    this.#elRef = elRef;

    this.#obs = mutationObs.create((mutations: MutationRecord[]) => {
      const nodes: Node[] = [];

      // Only trim white space inside direct descendants of the current element.
      for (const mutation of mutations) {
        if (mutation.target.parentNode === elRef.nativeElement) {
          nodes.push(mutation.target);
        }
      }

      this.#trim(nodes);
    });

    this.#observe();
  }

  public ngOnInit(): void {
    const el = this.#elRef.nativeElement as Element;
    this.#trim(Array.from(el.childNodes));
  }

  public ngOnDestroy(): void {
    this.#disconnect();
  }

  #observe(): void {
    this.#obs.observe(this.#elRef.nativeElement, {
      characterData: true,
      subtree: true,
    });
  }

  #disconnect(): void {
    this.#obs.disconnect();
  }

  #trim(nodes: Node[]): void {
    // Suspend the MutationObserver so altering the text content of each node
    // doesn't retrigger the observe callback.
    this.#disconnect();

    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const textContent = node.textContent;
        const textContentTrimmed = textContent.trim();

        if (textContent !== textContentTrimmed) {
          node.textContent = textContentTrimmed;
        }
      }
    }

    this.#observe();
  }
}
