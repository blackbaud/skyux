import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StackingContextService {
  #document: Document;

  constructor(@Inject(DOCUMENT) readonly document: Document) {
    this.#document = document;
  }

  /**
   * Get the z-index of an element's highest ancestor within a container.
   */
  public getZIndex(
    element: HTMLElement,
    withinElement: HTMLElement | string = 'body'
  ): number {
    const container = this.#findElement(withinElement);
    const ancestors = this.#getAncestors(element, container);
    const topAncestorWithZIndex = ancestors.find(
      (ancestor) => this.#getElementZIndex(ancestor) !== 0
    );
    if (topAncestorWithZIndex) {
      return this.#getElementZIndex(topAncestorWithZIndex);
    }
    return 0;
  }

  #findElement(element: HTMLElement | string): HTMLElement {
    if (typeof element === 'string') {
      return this.#document.querySelector(element) as HTMLElement;
    }

    return element;
  }

  #getAncestors(element: HTMLElement, container: HTMLElement): HTMLElement[] {
    const ancestors = [];
    if (container.contains(element)) {
      let parent: HTMLElement | null = element;
      while (parent && parent !== container) {
        ancestors.unshift(parent);
        parent = parent.parentElement;
      }
      ancestors.unshift(container);
    }
    return ancestors;
  }

  #getElementZIndex(element: HTMLElement): number {
    const computedStyle = this.#document.defaultView?.getComputedStyle(element);
    const zIndex = parseInt(`${computedStyle?.zIndex}`, 10);
    return isNaN(zIndex) ? 0 : zIndex;
  }
}
