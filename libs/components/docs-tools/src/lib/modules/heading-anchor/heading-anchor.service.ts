import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyDocsHeadingAnchorLink } from './heading-anchor-link';
import { SkyDocsHeadingAnchorComponent } from './heading-anchor.component';

/**
 * @internal
 */
@Injectable()
export class SkyDocsHeadingAnchorService implements OnDestroy {
  #anchors: SkyDocsHeadingAnchorComponent[] = [];
  #anchorElements = new Map<SkyDocsHeadingAnchorComponent, Element>();
  readonly #anchorsChange = new BehaviorSubject<SkyDocsHeadingAnchorLink[]>([]);

  public readonly anchorsChange = this.#anchorsChange.asObservable();

  public ngOnDestroy(): void {
    this.#anchors = [];
    this.#anchorElements.clear();
    this.#anchorsChange.complete();
  }

  public register(
    anchor: SkyDocsHeadingAnchorComponent,
    element: Element,
  ): void {
    if (!this.#anchors.includes(anchor)) {
      this.#anchors.push(anchor);
      this.#anchorElements.set(anchor, element);
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  public unregister(anchor: SkyDocsHeadingAnchorComponent): void {
    if (this.#anchors.includes(anchor)) {
      this.#anchors.splice(this.#anchors.indexOf(anchor), 1);
      this.#anchorElements.delete(anchor);
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  #getLinks(): SkyDocsHeadingAnchorLink[] {
    // Since heading anchors can be registered at any point in the lifecycle
    // of the app, we need to sort the links by their location in the DOM,
    // rather than the order at which they were registered.
    const anchorsSorted = [...this.#anchors].sort((a, b) => {
      const elA = this.#anchorElements.get(a);
      const elB = this.#anchorElements.get(b);

      if (!elA || !elB) {
        return 0;
      }

      const position = elA.compareDocumentPosition(elB);

      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        return -1;
      }

      if (position & Node.DOCUMENT_POSITION_PRECEDING) {
        return 1;
      }

      return 0;
    });

    return anchorsSorted.map((a) => {
      return {
        anchorId: a.anchorId(),
        categoryColor: a.categoryColor(),
        categoryTemplate: a.categoryTemplate(),
        categoryText: a.categoryText(),
        text: a.headingText(),
      } satisfies SkyDocsHeadingAnchorLink;
    });
  }
}
