import { Observable } from 'rxjs';

/**
 * Arguments passed to a filter modal when it opens.
 */
export interface SkyFilterItemModalOpenedArgs<
  TData = Record<string, unknown> | undefined,
> {
  /**
   * An observable representing data that is passed to the filter modal as additional context.
   */
  data?: Observable<TData>;
}
