import {
  ApplicationRef,
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import { BehaviorSubject, Observable, Subject, sample } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ResizeObserverScheduler } from './resize-observer-scheduler';

type ResizeObserverTracking = {
  observing: boolean;
  subject: Subject<ResizeObserverEntry>;
  subjectObservable: Observable<ResizeObserverEntry>;
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyResizeObserverService implements OnDestroy {
  #resizeObserver: ResizeObserver | undefined;
  readonly #scheduler = inject(ResizeObserverScheduler);
  readonly #tracking = new Map<Element, ResizeObserverTracking>();
  readonly #zone = inject(NgZone);

  constructor() {
    inject(ApplicationRef).onDestroy(() => this.ngOnDestroy());
  }

  public ngOnDestroy(): void {
    this.#tracking.forEach((value) => value.subject.complete());
    this.#cleanup();
    this.#resizeObserver?.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    return this.#observeAndTrack(element).subjectObservable;
  }

  #cleanup(): void {
    const untrackElements: Element[] = [];
    this.#tracking.forEach((value, element) => {
      // If the element is no longer in the DOM or no longer observed,
      // complete the subject and stop observing.
      if (!element.parentElement || !value.subject.observed) {
        this.#zone.run(() => value.subject.complete());
        this.#resizeObserver?.unobserve(element);
        untrackElements.push(element);
      }
    });
    untrackElements.forEach((element) => this.#tracking.delete(element));
  }

  #observeAndTrack(element: ElementRef): ResizeObserverTracking {
    const resizeObserver = this.#getResizeObserver();

    if (!this.#tracking.has(element.nativeElement)) {
      const box = element.nativeElement.getBoundingClientRect();
      const initialValue: ResizeObserverEntry = {
        target: element.nativeElement,
        borderBoxSize: [
          {
            blockSize: box.height,
            inlineSize: box.width,
          },
        ],
        contentRect: box,
        contentBoxSize: [
          {
            blockSize: box.height,
            inlineSize: box.width,
          },
        ],
        devicePixelContentBoxSize: [
          {
            blockSize: box.height,
            inlineSize: box.width,
          },
        ],
      };
      const subject = new BehaviorSubject<ResizeObserverEntry>(initialValue);
      const subjectObservable = subject.pipe(
        sample(this.#scheduler),
        finalize(() => this.#cleanup())
      );

      this.#tracking.set(element.nativeElement, {
        observing: false,
        subject,
        subjectObservable,
      });
    }

    const tracking = this.#tracking.get(
      element.nativeElement
    ) as ResizeObserverTracking;
    if (!tracking.observing && element.nativeElement.parentElement) {
      this.#zone.runOutsideAngular(() =>
        resizeObserver.observe(element.nativeElement)
      );
      tracking.observing = true;
    }
    return tracking;
  }

  #getResizeObserver(): ResizeObserver {
    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          entries.forEach((entry) => this.#callback(entry));
        }
      );
    }
    return this.#resizeObserver;
  }

  #callback(entry: ResizeObserverEntry): void {
    const tracking = this.#tracking.get(entry.target);
    if (tracking?.subject && tracking?.subject.closed === false) {
      tracking.subject.next(entry);
    }
  }
}
