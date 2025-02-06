import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject } from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyAppViewportReserveArgs } from './viewport-reserve-args';
import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';

type ReserveItemType = SkyAppViewportReserveArgs & {
  active: boolean;
};

/**
 * Provides information about the state of the application's viewport.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppViewportService {
  /**
   * Updated when the viewport becomes visible.  While the page is rendered, the
   * viewport may remain hidden as fonts and styles are loaded asynchronously;
   * this is done to avoid a FOUC (Flash Of Unstyled Content) before the fonts
   * and styles are ready.
   */
  public visible = new ReplaySubject<boolean>(1);

  readonly #reserveItems = new Map<string, ReserveItemType>();
  readonly #conditionallyReserveItems = new Map<Element, ReserveItemType>();
  readonly #document = inject(DOCUMENT);
  readonly #intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const item = this.#conditionallyReserveItems.get(entry.target);
        if (item) {
          item.active = entry.isIntersecting;
        }
      });
      this.#updateViewportArea();
    },
    {
      root: this.#document,
      threshold: Array.from({ length: 11 }, (_, i) => i / 10),
    },
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => this.#intersectionObserver.disconnect());
  }

  /**
   * Reserves space for components docked to the left, top, right, or bottom of the viewport.
   * @param args
   */
  public reserveSpace(args: SkyAppViewportReserveArgs): void {
    const item = {
      ...args,
      active: !args.reserveForElement,
    };
    this.#reserveItems.set(args.id, item);
    this.#watchVisibility(item);
    this.#updateViewportArea();
  }

  /**
   * Removes reserved space for a component by the ID provided when it was reserved.
   * @param id
   */
  public unreserveSpace(id: string): void {
    const args = this.#reserveItems.get(id);
    if (args?.reserveForElement) {
      this.#intersectionObserver.unobserve(args.reserveForElement);
      this.#conditionallyReserveItems.delete(args.reserveForElement);
    }
    this.#reserveItems.delete(id);
    this.#updateViewportArea();
  }

  #updateViewportArea(): void {
    const reservedSpaces: {
      [key in SkyAppViewportReservedPositionType]: number;
    } = {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };

    for (const { position, size, active } of this.#reserveItems.values()) {
      if (active) {
        reservedSpaces[position] += size;
      }
    }

    const documentElementStyle = this.#document.documentElement.style;

    for (const [position, size] of Object.entries(reservedSpaces)) {
      documentElementStyle.setProperty(
        `--sky-viewport-${position}`,
        size + 'px',
      );
    }
  }

  #watchVisibility(item: ReserveItemType): void {
    if (item.reserveForElement) {
      this.#conditionallyReserveItems.set(item.reserveForElement, item);
      this.#intersectionObserver.observe(item.reserveForElement);
    }
  }
}
