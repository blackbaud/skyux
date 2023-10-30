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
  first,
  throttle,
} from 'rxjs';

type ResizeObserverTracking = {
  resizeObserver: ResizeObserver;
  subject: Subject<ResizeObserverEntry>;
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyResizeObserverService implements OnDestroy {
  readonly #tracking = new Map<ElementRef, ResizeObserverTracking>();
  readonly #zone = inject(NgZone);

  public ngOnDestroy(): void {
    this.#tracking.forEach((tracking) => {
      tracking.resizeObserver.disconnect();
      tracking.subject.complete();
    });
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    const subject = new Subject<ResizeObserverEntry>();
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        this.#zone.run(() => subject.next(entries[0]));
      }
    );
    this.#tracking.set(element, { subject, resizeObserver });
    resizeObserver.observe(element.nativeElement);
    return subject.pipe(
      filter(Boolean),
      throttle(() => animationFrames().pipe(first()), {
        leading: false,
        trailing: true,
      }),
      finalize(() => {
        resizeObserver.disconnect();
        subject.complete();
      })
    );
  }
}
