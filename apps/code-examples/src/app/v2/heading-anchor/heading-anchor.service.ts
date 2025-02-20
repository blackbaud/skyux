import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyHeadingAnchorComponent } from './heading-anchor.component';

interface SkyHeadingAnchorLink {
  anchorId: string;
  title: string;
}

/**
 * @internal
 */
@Injectable()
export class SkyHeadingAnchorService {
  #anchors: SkyHeadingAnchorComponent[] = [];
  #anchorsChange = new BehaviorSubject<SkyHeadingAnchorLink[]>([]);

  public readonly anchorsChange = this.#anchorsChange.asObservable();

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

  #getLinks() {
    return this.#anchors.map((a) => {
      return {
        anchorId: a.headingId(),
        title: a.headingText(),
      };
    });
  }
}
