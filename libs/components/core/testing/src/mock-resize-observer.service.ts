import { ElementRef, Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, filter, finalize } from 'rxjs';

type ResizeObserverTracking = {
  subject: Subject<ResizeObserverEntry>;
};

@Injectable()
export class MockSkyResizeObserverService implements OnDestroy {
  readonly #tracking = new Map<ElementRef, ResizeObserverTracking>();

  public ngOnDestroy(): void {
    this.#tracking.forEach((tracking) => tracking.subject.complete());
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    const subject = new Subject<ResizeObserverEntry>();
    this.#tracking.set(element, { subject });
    return subject.pipe(
      filter(Boolean),
      finalize(() => subject.complete())
    );
  }

  public mockEmit(element: ElementRef, entry: ResizeObserverEntry): void {
    const tracking = this.#tracking.get(element);
    if (tracking) {
      tracking.subject.next(entry);
    }
  }
}
