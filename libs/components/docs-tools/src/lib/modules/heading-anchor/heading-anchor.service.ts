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
  readonly #anchorsChange = new BehaviorSubject<SkyDocsHeadingAnchorLink[]>([]);

  public readonly anchorsChange = this.#anchorsChange.asObservable();

  public ngOnDestroy(): void {
    this.#anchors = [];
    this.#anchorsChange.complete();
  }

  public register(anchor: SkyDocsHeadingAnchorComponent): void {
    if (!this.#anchors.includes(anchor)) {
      this.#anchors.push(anchor);
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  public unregister(anchor: SkyDocsHeadingAnchorComponent): void {
    if (this.#anchors.includes(anchor)) {
      this.#anchors.splice(this.#anchors.indexOf(anchor));
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  #getLinks(): SkyDocsHeadingAnchorLink[] {
    const els = document.querySelectorAll('sky-docs-heading-anchor');
    const anchorsSorted: SkyDocsHeadingAnchorComponent[] = [];

    // Since heading anchors can be registered at any point in the lifecycle
    // of the app, we need to sort the links by their location in the DOM,
    // rather than the order at which they were registered.
    for (const el of els) {
      this.#anchors.forEach((anchor) => {
        if (anchor.equals(el)) {
          anchorsSorted.push(anchor);
        }
      });
    }

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
