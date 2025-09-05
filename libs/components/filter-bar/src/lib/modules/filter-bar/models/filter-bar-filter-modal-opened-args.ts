import { Observable } from 'rxjs';

/**
 * Arguments passed when a filter modal is opened.
 */
export interface SkyFilterBarFilterModalOpenedArgs {
  /**
   * An Observable representing data passed into the filter modal as additional context.
   */
  data?: Observable<Record<string, unknown> | undefined>;
}
