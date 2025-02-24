import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyHeadingAnchorLink } from './heading-anchor-link';
import { SkyHeadingAnchorComponent } from './heading-anchor.component';

/**
 * @internal
 */
@Injectable()
export class SkyHeadingAnchorService implements OnDestroy {
  readonly #anchors: SkyHeadingAnchorComponent[] = [];
  readonly #anchorsChange = new BehaviorSubject<SkyHeadingAnchorLink[]>([]);

  public readonly anchorsChange = this.#anchorsChange.asObservable();

  public ngOnDestroy(): void {
    this.#anchorsChange.complete();
  }

  public register(anchor: SkyHeadingAnchorComponent): void {
    if (!this.#anchors.includes(anchor)) {
      this.#anchors.push(anchor);
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  public unregister(anchor: SkyHeadingAnchorComponent): void {
    if (this.#anchors.includes(anchor)) {
      this.#anchors.splice(this.#anchors.indexOf(anchor));
      this.#anchorsChange.next(this.#getLinks());
    }
  }

  #getLinks(): SkyHeadingAnchorLink[] {
    return this.#anchors.map((a) => {
      return {
        anchorId: a.anchorId(),
        text: a.headingText(),
      };
    });
  }
}
