import { Observable } from 'rxjs';

/**
 * Arguments passed to a filter modal when it opens.
 */
export interface SkyFilterItemModalOpenedArgs<
  TData = Record<string, unknown> | undefined,
> {
  /**
   * The unique identifier for the filter.
   */
  filterId: string;
  /**
   * An observable representing data that is passed to the filter modal as additional context.
   */
  data?: Observable<TData>;
}
