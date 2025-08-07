import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, NgZone, inject } from '@angular/core';

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
  #updateRequest: number | undefined = undefined;
  readonly #reserveItems = new Map<string, ReserveItemType>();
  readonly #conditionallyReserveItems = new Map<Element, ReserveItemType>();
  readonly #document = inject(DOCUMENT);
  readonly #ngZone = inject(NgZone);
  // Observe elements crossing the browser's viewport boundaries.
  readonly #intersectionObserver = this.#ngZone.runOutsideAngular(
    () =>
      new IntersectionObserver(
        () => this.#ngZone.run(() => this.#updateViewportArea()),
        { threshold: Array.from({ length: 101 }, (_, i) => i / 100) },
      ),
  );
  #reservedSpaces: Record<SkyAppViewportReservedPositionType, number> = {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  };

  constructor() {
    const onScroll = (): void => {
      if (this.#conditionallyReserveItems.size > 0) {
        this.#updateViewportArea();
      }
    };
    this.#document.addEventListener('scroll', onScroll);
    inject(DestroyRef).onDestroy(() => {
      /* istanbul ignore next */
      if (this.#updateRequest !== undefined) {
        cancelAnimationFrame(this.#updateRequest);
      }
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
      active: this.#isElementVisible({ ...args, active: false }),
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
      this.#updateRequest = undefined;
      const reservedSpaces: Record<SkyAppViewportReservedPositionType, number> =
        {
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        };

      for (const args of this.#reserveItems.values()) {
        args.active = this.#isElementVisible(args, reservedSpaces);
        if (args.active) {
          reservedSpaces[args.position] += args.size;
        }
      }

      this.#reservedSpaces = reservedSpaces;
      const documentElementStyle = this.#document.documentElement.style;

      for (const [position, size] of Object.entries(reservedSpaces)) {
        documentElementStyle.setProperty(
          `--sky-viewport-${position}`,
          size + 'px',
        );
      }
    });
  }

  #watchVisibility(item: ReserveItemType): void {
    if (item.reserveForElement) {
      this.#conditionallyReserveItems.set(item.reserveForElement, item);
      this.#intersectionObserver.observe(item.reserveForElement);
    }
  }

  #isElementVisible(
    args: ReserveItemType,
    reservedSpaces: Record<SkyAppViewportReservedPositionType, number> = this
      .#reservedSpaces,
  ): boolean {
    if (!args.reserveForElement) {
      return true;
    }
    const rect = args.reserveForElement.getBoundingClientRect();
    if (!rect || !rect.height || !rect.width) {
      return false;
    }
    const midpoint = {
      x: rect.x + Math.floor(rect.width / 2),
      y: rect.y + Math.floor(rect.height / 2),
    };
    if (
      // Vertically in view
      midpoint.y <= window.innerHeight &&
      midpoint.y >= 0 &&
      // Horizontally in view
      midpoint.x <= window.innerWidth &&
      midpoint.x >= 0
    ) {
      // Element is not hidden by another element
      if (
        args.reserveForElement.contains(
          this.#document.elementFromPoint(midpoint.x, midpoint.y),
        )
      ) {
        return true;
      }

      // Check if the item's midpoint is visible based on current reserved spaces.
      // Assumes reserved spaces are intended to be additive and not overlapping.
      const threshold = reservedSpaces[args.position];
      switch (args.position) {
        case 'top':
          return midpoint.y >= threshold;
        case 'right':
          return midpoint.x <= window.innerWidth - threshold;
        case 'bottom':
          return midpoint.y <= window.innerHeight - threshold;
        case 'left':
          return midpoint.x >= threshold;
      }
    }
    return false;
  }
}
