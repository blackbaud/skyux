import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

type ResizeObserverTracking = {
  element: Element;
  subject: Subject<ResizeObserverEntry>;
  subjectObservable: Observable<ResizeObserverEntry>;
  breakpointChanges?: Subject<SkyMediaBreakpoints>;
  currentBreakpoint?: SkyMediaBreakpoints;
};

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable({
  providedIn: 'any',
})
export class SkyResizeObserverService implements OnDestroy {
  private _resizeObserver: ResizeObserver;
  private _tracking: ResizeObserverTracking[] = [];

  constructor(private zone: NgZone) {
    this._resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => this.callback(entry));
      }
    );
  }

  public ngOnDestroy(): void {
    this._resizeObserver.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    return this.observeAndTrack(element).subjectObservable;
  }

  private observeAndTrack(element: ElementRef): ResizeObserverTracking {
    const checkTracking = this._tracking.findIndex((value) => {
      return !value.subject.closed && value.element === element.nativeElement;
    });
    if (checkTracking === -1) {
      this._resizeObserver.observe(element.nativeElement);
    }
    const subject = new Subject<ResizeObserverEntry>();
    const subjectObservable = subject.pipe(
      finalize(() => {
        // Are there any other tracking entries still watching this element?
        const checkTracking = this._tracking.findIndex((value) => {
          return (
            value.subject !== subject &&
            !value.subject.closed &&
            value.element === element.nativeElement
          );
        });
        if (checkTracking === -1) {
          this._resizeObserver.unobserve(element.nativeElement);
        }
      })
    );
    const tracking = {
      element: element.nativeElement,
      subject,
      subjectObservable,
    };
    this._tracking.push(tracking);
    return tracking;
  }

  private callback(entry: ResizeObserverEntry) {
    this._tracking
      .filter((value) => !(value.subject.closed || value.subject.isStopped))
      .forEach((value) => {
        /* istanbul ignore else */
        if (value.element === entry.target) {
          this.zone.run(() => {
            value.subject.next(entry);
          });
        }
      });
  }
}
