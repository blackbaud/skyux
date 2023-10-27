import {
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  MonoTypeOperatorFunction,
  Observable,
  Subscriber,
  animationFrames,
  filter,
  sample,
  tap,
} from 'rxjs';

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyResizeObserverService implements OnDestroy {
  readonly #scheduler: { <T>(): MonoTypeOperatorFunction<T> };
  readonly #tracking: Subscriber<ResizeObserverEntry>[] = [];
  readonly #zone = inject(NgZone);

  constructor() {
    // If Promise is patched by zone.js/testing, use tap() to immediately emit
    // the resize event. Otherwise, use sample() to emit the resize event on the
    // next animation frame.
    // todo: refactor this to use a provider to inject the scheduler or find another way
    if ('__zone_symbol__patchPromiseForTest' in Promise) {
      this.#scheduler = <T>(): MonoTypeOperatorFunction<T> => tap();
    } else {
      this.#scheduler = <T>(): MonoTypeOperatorFunction<T> =>
        sample(animationFrames());
    }
  }

  public ngOnDestroy(): void {
    this.#tracking.forEach((value) => value.complete());
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    const obs = new Observable<ResizeObserverEntry>(
      (subscriber: Subscriber<ResizeObserverEntry>) => {
        const resizeObserver = new ResizeObserver(
          (entries: ResizeObserverEntry[]) =>
            this.#zone.run(() => subscriber.next(entries[0]))
        );
        resizeObserver.observe(element.nativeElement);
        this.#tracking.push(subscriber);
        return () => {
          resizeObserver.unobserve(element.nativeElement);
          resizeObserver.disconnect();
          const idx = this.#tracking.findIndex((val) => val === subscriber);
          this.#tracking.splice(idx, 1);
        };
      }
    );
    return obs.pipe(filter(Boolean), this.#scheduler());
  }
}
