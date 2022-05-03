import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

type ResizeObserverTracking = {
  element: Element;
  subject: Subject<ResizeObserverEntry>;
  subjectObservable: Observable<ResizeObserverEntry>;
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyResizeObserverService implements OnDestroy {
  #resizeObserver: ResizeObserver;

  #tracking: ResizeObserverTracking[] = [];

  constructor(private zone: NgZone) {
    this.#resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => this.callback(entry));
      }
    );
  }

  public ngOnDestroy(): void {
    this.#resizeObserver.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    return this.observeAndTrack(element).subjectObservable;
  }

  private observeAndTrack(element: ElementRef): ResizeObserverTracking {
    const checkTracking = this.#tracking.findIndex((value) => {
      return !value.subject.closed && value.element === element.nativeElement;
    });

    if (checkTracking === -1) {
      this.#resizeObserver.observe(element.nativeElement);
    }

    const subject = new Subject<ResizeObserverEntry>();
    const subjectObservable = subject.pipe(
      finalize(() => {
        // Are there any other tracking entries still watching this element?
        const checkTracking = this.#tracking.findIndex((value) => {
          return (
            value.subject !== subject &&
            !value.subject.closed &&
            value.element === element.nativeElement
          );
        });

        if (checkTracking === -1) {
          this.#resizeObserver.unobserve(element.nativeElement);
        }
      })
    );

    const tracking = {
      element: element.nativeElement,
      subject,
      subjectObservable,
    };

    this.#tracking.push(tracking);

    return tracking;
  }

  private callback(entry: ResizeObserverEntry): void {
    this.#tracking
      .filter((value) => !(value.subject.closed || value.subject.isStopped))
      .forEach((value) => {
        if (value.element === entry.target) {
          this.zone.run(() => {
            value.subject.next(entry);
          });
        }
      });
  }
}
