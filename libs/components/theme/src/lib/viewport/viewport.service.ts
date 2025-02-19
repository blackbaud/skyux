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

  // ESLint doesn't recognize how this is used.
  // eslint-disable-next-line no-unused-private-class-members
  #updateRequest: number | undefined = undefined;
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
    const onScroll = (): void => {
      if (this.#conditionallyReserveItems.size > 0) {
        this.#updateViewportArea();
      }
    };
    this.#document.addEventListener('scroll', onScroll);
    inject(DestroyRef).onDestroy(() => {
      this.#intersectionObserver.disconnect();
      this.#document.removeEventListener('scroll', onScroll);
    });
  }

  /**
   * Reserves space for components docked to the left, top, right, or bottom of the viewport.
   * @param args
   */
  public reserveSpace(args: SkyAppViewportReserveArgs): void {
    const item = {
      ...args,
      active:
        !args.reserveForElement ||
        this.#isElementVisible(args.reserveForElement),
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
    this.#updateRequest ??= requestAnimationFrame(() => {
      const reservedSpaces: {
        [key in SkyAppViewportReservedPositionType]: number;
      } = {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      };

      for (const {
        position,
        size,
        active,
        reserveForElement,
      } of this.#reserveItems.values()) {
        if (
          active &&
          (!reserveForElement || this.#isElementVisible(reserveForElement))
        ) {
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

      this.#updateRequest = undefined;
    });
  }

  #watchVisibility(item: ReserveItemType): void {
    if (item.reserveForElement) {
      this.#conditionallyReserveItems.set(item.reserveForElement, item);
      this.#intersectionObserver.observe(item.reserveForElement);
    }
  }

  #isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      // Vertically in view
      rect.y <= window.innerHeight &&
      rect.y >= 0 &&
      // Horizontally in view
      rect.x <= window.innerWidth &&
      rect.x >= 0 &&
      // Element is not hidden by another element
      element.contains(this.#document.elementFromPoint(rect.x + 1, rect.y + 1))
    );
  }
}
