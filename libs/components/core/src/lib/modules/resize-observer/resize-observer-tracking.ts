import { Observable, Subject } from 'rxjs';

/**
 * @internal
 */
export interface SkyResizeObserverTracking {
  element: Element;
  subject: Subject<ResizeObserverEntry>;
  subjectObservable: Observable<ResizeObserverEntry>;
}
