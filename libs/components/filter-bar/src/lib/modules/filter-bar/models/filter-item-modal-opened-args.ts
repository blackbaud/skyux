import { Observable } from 'rxjs';

/**
 * Arguments passed when a filter modal is opened.
 */
export interface SkyFilterItemModalOpenedArgs<
  TData = Record<string, unknown> | undefined,
> {
  /**
   * An Observable representing data passed into the filter modal as additional context.
   */
  data?: Observable<TData>;
}
