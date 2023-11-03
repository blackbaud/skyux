import {
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  Observable,
  Subject,
  animationFrames,
  filter,
  finalize,
  take,
  throttle,
} from 'rxjs';

import { SkyAppWindowRef } from '../window/window-ref';

type ResizeObserverTracking = {
  subject: Subject<ResizeObserverEntry>;
  subjectObservable: Observable<ResizeObserverEntry>;
  destroy: () => void;
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyResizeObserverService implements OnDestroy {
  readonly #errorTest = /ResizeObserver loop/i;
  readonly #resizeObserver = new ResizeObserver((entries) =>
    this.#zone.run(() => entries.forEach((entry) => this.#callback(entry)))
  );
  #teardownInProgress = false;
  readonly #tracking = new Map<Element, ResizeObserverTracking>();
  readonly #window = inject(SkyAppWindowRef);
  readonly #zone = inject(NgZone);
  #originalOnError:
    | ((event: string | Event) => boolean | undefined)
    | undefined;

  constructor() {
    this.#expectWindowError();
  }

  public ngOnDestroy(): void {
    this.#teardownInProgress = true;
    this.#zone.runOutsideAngular(() => this.#resizeObserver.disconnect());
    this.#tracking.forEach((tracking) => {
      tracking.subject.complete();
      tracking.subject.unsubscribe();
    });
    this.#resetWindowError();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    return this.#observeAndTrack(element as ElementRef<Element>)
      .subjectObservable;
  }

  #observeAndTrack(element: ElementRef<Element>): ResizeObserverTracking {
    const checkTracking = this.#tracking.get(element.nativeElement);

    if (!checkTracking || checkTracking.subject.closed) {
      const subject = new Subject<ResizeObserverEntry>();
      const destroy = (): void => {
        if (!subject.observed) {
          this.#teardownInProgress = true;
          this.#zone.runOutsideAngular(() =>
            this.#resizeObserver.unobserve(element.nativeElement)
          );
          this.#teardownInProgress = false;
          subject.complete();
        }
      };
      const subjectObservable = subject.pipe(
        finalize(destroy),
        filter(Boolean),
        throttle(() => animationFrames().pipe(take(1)), {
          leading: false,
          trailing: true,
        })
      );
      this.#tracking.set(element.nativeElement, {
        subject,
        subjectObservable,
        destroy,
      });
      this.#zone.runOutsideAngular(() =>
        this.#resizeObserver.observe(element.nativeElement)
      );
    }

    return this.#tracking.get(element.nativeElement) as ResizeObserverTracking;
  }

  #callback(entry: ResizeObserverEntry): void {
    const value = this.#tracking.get(entry.target);
    if (value && !value.subject.closed && value.subject.observed) {
      value.subject.next(entry);
    }
  }

  #expectWindowError(): void {
    // ResizeObserver throws an error when it is disconnected while it is
    // still observing an element. When an element is no longer observed, this
    // is not a concern.
    this.#window.nativeWindow.addEventListener(
      'error',
      this.#errorHandler.bind(this)
    );
    this.#originalOnError = this.#window.nativeWindow.onerror;
    this.#window.nativeWindow.onerror = this.#onError.bind(this);
  }

  #resetWindowError(): void {
    this.#window.nativeWindow.removeEventListener('error', this.#errorHandler);
    if (this.#originalOnError) {
      this.#window.nativeWindow.onerror = this.#originalOnError;
      this.#originalOnError = undefined;
    }
  }

  #errorHandler(event: ErrorEvent): boolean | undefined {
    if (this.#teardownInProgress && this.#errorTest.test(event.message)) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
    return true;
  }

  #onError(event: string | ErrorEvent): boolean | undefined {
    const message = typeof event === 'string' ? event : event.message;
    // This is necessary to prevent the test runner from failing on errors, but challenging to reliably test.
    /* istanbul ignore next */
    if (this.#teardownInProgress && this.#errorTest.test(message)) {
      return false;
    }
    return this.#originalOnError?.call(this.#window.nativeWindow, event);
  }
}
