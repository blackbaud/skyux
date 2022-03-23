import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Service to create rxjs observables for changes to the content box dimensions of elements.
 */
@Injectable()
export class SkyResizeObserverService implements OnDestroy {
  private tracking: {
    element: Element;
    subject: Subject<ResizeObserverEntry>;
  }[] = [];

  private resizeObserver: ResizeObserver;

  constructor(private zone: NgZone) {
    this.resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => this.callback(entry));
      }
    );
  }

  public ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  /**
   * Create rxjs observable to get size changes for an element ref.
   * @param element
   * @return Observable<ResizeObserverEntry>
   */
  public observe(element: ElementRef): Observable<ResizeObserverEntry> {
    this.resizeObserver.observe(element.nativeElement, { box: 'border-box' });
    const subject = new Subject<ResizeObserverEntry>();
    this.tracking.push({ element: element.nativeElement, subject });
    return subject.pipe(
      finalize(() => {
        this.resizeObserver.unobserve(element.nativeElement);
      })
    );
  }

  private callback(entry: ResizeObserverEntry) {
    this.tracking
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
