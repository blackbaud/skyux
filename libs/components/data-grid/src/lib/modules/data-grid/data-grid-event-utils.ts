import {
  AgEventListener,
  AgEventTypeParams,
  AgPublicEventType,
  GridApi,
} from 'ag-grid-community';
import { Observable } from 'rxjs';

/**
 * @internal
 */
export function fromGridEvent<
  TEventType extends AgPublicEventType,
  TData = unknown,
  TContext = unknown,
>(
  target: Pick<
    GridApi,
    'addEventListener' | 'removeEventListener' | 'isDestroyed'
  >,
  eventType: TEventType,
): Observable<AgEventTypeParams<TData, TContext>[TEventType]> {
  return new Observable<AgEventTypeParams<TData, TContext>[TEventType]>(
    (subscriber) => {
      const handler: AgEventListener<TData, TContext, TEventType> = (
        event: AgEventTypeParams<TData, TContext>[TEventType],
      ): void => subscriber.next(event);
      target.addEventListener(eventType, handler);

      return () => {
        if (!target.isDestroyed || !target.isDestroyed()) {
          target.removeEventListener(eventType, handler);
        }
      };
    },
  );
}
