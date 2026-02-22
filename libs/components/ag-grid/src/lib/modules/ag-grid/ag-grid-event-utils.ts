import {
  AgEventListener,
  AgEventTypeParams,
  AgPublicEventType,
  GridApi,
} from 'ag-grid-community';
import { Observable } from 'rxjs';

/**
 * Creates an Observable from an AG Grid event that properly handles cleanup
 * when the Observable is unsubscribed. This is a replacement for RxJS's `fromEvent`
 * which is incompatible with AG Grid 35's addEventListener/removeEventListener types.
 *
 * @param target The AG Grid GridApi.
 * @param eventType The event name (e.g., 'gridPreDestroyed', 'rowDataUpdated', 'filterChanged')
 * @returns An Observable that emits when the event fires
 *
 * @example
 * ```typescript
 * // Grid API events
 * createGridEvent(agGrid.api, 'gridPreDestroyed')
 *   .pipe(takeUntil(destroy$))
 *   .subscribe(() => console.log('Grid destroyed'));
 * ```
 */
export function fromGridEvent<
  TEventType extends AgPublicEventType,
  TData = any,
  TContext = any,
>(
  target: Pick<GridApi, 'addEventListener' | 'removeEventListener'>,
  eventType: TEventType,
): Observable<AgEventTypeParams<TData, TContext>[TEventType]> {
  return new Observable<AgEventTypeParams<TData, TContext>[TEventType]>(
    (subscriber) => {
      const handler: AgEventListener<TData, TContext, TEventType> = (
        event: AgEventTypeParams<TData, TContext>[TEventType],
      ): void => subscriber.next(event);
      target.addEventListener(eventType, handler);

      // Cleanup function called when Observable is unsubscribed
      return () => {
        target.removeEventListener(eventType, handler);
      };
    },
  );
}
