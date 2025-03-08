import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Injectable,
  NgZone,
  RendererFactory2,
  inject,
} from '@angular/core';

import { ReplaySubject } from 'rxjs';

import { SkyAppViewportReserveArgs } from './viewport-reserve-args';
import { SkyAppViewportReservedPositionType } from './viewport-reserve-position-type';

type ReserveItemType = SkyAppViewportReserveArgs & {
  active: boolean;
};

const SKY_APP_VIEWPORT_ROOT_ID = 'sky-app-viewport-root';
const threshold = Array.from({ length: 101 }, (_, i) => i / 100);

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
  readonly #ngZone = inject(NgZone);
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);
  #viewportRoot: HTMLElement | undefined;
  // Observe elements crossing the --sky-viewport boundaries, using 5px margin because elements likely won't cross the actual boundary.
  readonly #skyViewportIntersectionObserver = this.#ngZone.runOutsideAngular(
    () =>
      new IntersectionObserver(
        () => this.#ngZone.run(() => this.#updateViewportArea()),
        { root: this.#getViewportRoot(), rootMargin: '-5px', threshold },
      ),
  );
  // Observe elements crossing the browser's viewport boundaries.
  readonly #windowIntersectionObserver = this.#ngZone.runOutsideAngular(
    () =>
      new IntersectionObserver(
        () => this.#ngZone.run(() => this.#updateViewportArea()),
        { threshold },
      ),
  );

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#skyViewportIntersectionObserver.disconnect();
      this.#windowIntersectionObserver.disconnect();
      this.#viewportRoot?.remove();
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
      this.#skyViewportIntersectionObserver.unobserve(args.reserveForElement);
      this.#windowIntersectionObserver.unobserve(args.reserveForElement);
      this.#conditionallyReserveItems.delete(args.reserveForElement);
    }
    this.#reserveItems.delete(id);
    this.#updateViewportArea();
  }

  #updateViewportArea(): void {
    this.#updateRequest ??= requestAnimationFrame(() => {
      this.#updateRequest = undefined;
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
        reserveForElement,
      } of this.#reserveItems.values()) {
        if (!reserveForElement || this.#isElementVisible(reserveForElement)) {
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
    });
  }

  #watchVisibility(item: ReserveItemType): void {
    if (item.reserveForElement) {
      this.#conditionallyReserveItems.set(item.reserveForElement, item);
      this.#skyViewportIntersectionObserver.observe(item.reserveForElement);
      this.#windowIntersectionObserver.observe(item.reserveForElement);
    }
  }

  #isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    if (
      // Vertically in view
      rect.y <= window.innerHeight &&
      rect.y >= 0 &&
      // Horizontally in view
      rect.x <= window.innerWidth &&
      rect.x >= 0
    ) {
      // Element is not hidden by another element
      const stackElements = this.#document.elementsFromPoint(
        rect.x + Math.floor(rect.width / 2),
        rect.y + Math.floor(rect.height / 2),
      );
      const rolesToIgnore = ['presentation', 'progressbar'];
      const ignoreSelectors = rolesToIgnore
        .map((r) => `[role="${r}"], [role="${r}"] *`)
        .join(', ');
      for (const stackElement of stackElements) {
        if (element.contains(stackElement)) {
          return true;
        }
        if (stackElement.matches(ignoreSelectors)) {
          continue;
        }
        return false;
      }
    }
    return false;
  }

  #getViewportRoot(): HTMLElement {
    this.#viewportRoot ??=
      this.#document.getElementById(SKY_APP_VIEWPORT_ROOT_ID) ?? undefined;
    if (this.#viewportRoot?.parentElement !== this.#document.body) {
      this.#viewportRoot?.remove();
      this.#viewportRoot = this.#renderer.createElement('div') as HTMLElement;
      this.#viewportRoot.setAttribute('id', SKY_APP_VIEWPORT_ROOT_ID);
      this.#viewportRoot.style.position = 'absolute';
      this.#viewportRoot.style.top = 'var(--sky-viewport-top, 0)';
      this.#viewportRoot.style.right = 'var(--sky-viewport-right, 0)';
      this.#viewportRoot.style.bottom = 'var(--sky-viewport-bottom, 0)';
      this.#viewportRoot.style.left = 'var(--sky-viewport-left, 0)';
      this.#viewportRoot.style.pointerEvents = 'none';
      this.#renderer.appendChild(this.#document.body, this.#viewportRoot);
    }
    return this.#viewportRoot;
  }
}
