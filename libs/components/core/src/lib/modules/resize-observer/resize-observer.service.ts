import {
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SkyAppWindowRef } from '../window/window-ref';

type ResizeObserverTracking = {
  element: Element;
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
  #next = new Map<Subject<ResizeObserverEntry>, number>();
  #resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => this.#callback(entry));
  });
  #tracking: ResizeObserverTracking[] = [];
  #window = inject(SkyAppWindowRef);
  #zone = inject(NgZone);

  public ngOnDestroy(): void {
    this.#next.forEach((value) =>
      this.#window.nativeWindow.cancelAnimationFrame(value)
    );
    this.#tracking.forEach((value) => {
      value.subject.complete();
      this.#resizeObserver.unobserve(value.element);
    });
    this.#resizeObserver.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    return this.#observeAndTrack(element).subjectObservable;
  }

  #observeAndTrack(element: ElementRef): ResizeObserverTracking {
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
          const deleteTracking = this.#tracking.findIndex(
            (value) => value.subject === subject
          );
          if (deleteTracking > -1) {
            this.#tracking.splice(deleteTracking, 1);
          }
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

  #callback(entry: ResizeObserverEntry): void {
    this.#tracking
      .filter((value) => !value.subject.closed)
      .forEach((value) => {
        /* istanbul ignore else */
        if (value.element === entry.target) {
          // Execute the callback within NgZone because Angular does not "monkey patch"
          // ResizeObserver like it does for other features in the DOM.
          if (this.#next.has(value.subject)) {
            this.#window.nativeWindow.cancelAnimationFrame(
              this.#next.get(value.subject)
            );
          }
          this.#next.set(
            value.subject,
            (this.#window.nativeWindow as Window).requestAnimationFrame(() => {
              this.#zone.run(() => {
                value.subject.next(entry);
              });
            })
          );
        }
      });
  }
}
