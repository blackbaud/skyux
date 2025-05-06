import {
  ApplicationRef,
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  Observable,
  Subject,
  animationFrameScheduler,
  distinctUntilChanged,
  filter,
  map,
  observeOn,
  shareReplay,
  takeUntil,
} from 'rxjs';

import { SkyAppWindowRef } from '../window/window-ref';

const errorTest =
  /ResizeObserver loop completed with undelivered notifications/i;
let errorLogRegistered = false;
let originalOnError:
  | ((event: string | Event) => boolean | undefined)
  | undefined = undefined;

const errorHandler = (event: ErrorEvent): boolean | undefined => {
  if (errorTest.test(event.message)) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
  return undefined;
};

const onError = (event: string | ErrorEvent): boolean | undefined => {
  const message = typeof event === 'string' ? event : event.message;
  // This is necessary to prevent the test runner from failing on errors, but challenging to reliably test.
  /* istanbul ignore next */
  if (errorTest.test(message)) {
    if (event instanceof ErrorEvent) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
    }
    return false;
  }
  return originalOnError?.call(window, event);
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyResizeObserverService implements OnDestroy {
  readonly #ngUnsubscribe = new Subject<void>();
  readonly #zone = inject(NgZone);
  readonly #resizeObserver = this.#zone.runOutsideAngular(
    () =>
      new ResizeObserver((entries) =>
        this.#zone.run(() => this.#resizeSubject.next(entries)),
      ),
  );
  readonly #resizeSubject = new Subject<ResizeObserverEntry[]>();
  readonly #tracking = new Map<Element, Observable<ResizeObserverEntry>>();
  readonly #window = inject(SkyAppWindowRef);

  constructor() {
    this.#expectWindowError();
    // Because the resize observer is a native browser API, it does not shut down
    // synchronously when the service is destroyed. Leave the error handling
    // accommodation in place until the application is destroyed. This also works
    // for the test runner.
    inject(ApplicationRef).onDestroy(() => this.#resetWindowError());
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#resizeObserver.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    const checkTracking = this.#tracking.has(element.nativeElement);

    if (!checkTracking) {
      this.#tracking.set(
        element.nativeElement,
        new Observable<ResizeObserverEntry[]>((observer) => {
          const subscription = this.#resizeSubject.subscribe(observer);
          this.#resizeObserver?.observe(element.nativeElement);
          return (): void => {
            this.#resizeObserver?.unobserve(element.nativeElement);
            subscription.unsubscribe();
            this.#tracking.delete(element.nativeElement);
          };
        }).pipe(
          filter(Boolean),
          filter((entries) =>
            entries.some((entry) => entry.target === element.nativeElement),
          ),
          map(
            (entries) =>
              entries.find(
                (entry) => entry.target === element.nativeElement,
              ) as ResizeObserverEntry,
          ),
          // Ignore subpixel changes.
          distinctUntilChanged(
            (a, b) =>
              Math.round(a.contentRect.width) ===
                Math.round(b.contentRect.width) &&
              Math.round(a.contentRect.height) ===
                Math.round(b.contentRect.height),
          ),
          // Emit the last value for late subscribers. Track references so it
          // un-observes when all subscribers are gone.
          shareReplay({ bufferSize: 1, refCount: true }),
          // Only emit prior to an animation frame to prevent layout thrashing.
          observeOn(animationFrameScheduler),
          takeUntil(this.#ngUnsubscribe),
        ),
      );
    }

    return this.#tracking.get(
      element.nativeElement,
    ) as Observable<ResizeObserverEntry>;
  }

  #expectWindowError(): void {
    if (!errorLogRegistered) {
      errorLogRegistered = true;
      // ResizeObserver throws an error when it is disconnected while it is
      // still observing an element. When an element is no longer observed, this
      // is not a concern.
      this.#zone.runOutsideAngular(() =>
        this.#window.nativeWindow.addEventListener('error', errorHandler),
      );
    }
    if (this.#window.nativeWindow.onerror !== onError) {
      originalOnError = this.#window.nativeWindow.onerror;
      this.#window.nativeWindow.onerror = onError;
    }
  }

  #resetWindowError(): void {
    this.#window.nativeWindow.removeEventListener('error', errorHandler);
    if (originalOnError) {
      this.#window.nativeWindow.onerror = originalOnError;
      originalOnError = undefined;
    }
    errorLogRegistered = false;
  }
}
