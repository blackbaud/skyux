import { Observable } from 'rxjs';

/**
 * @internal
 */
export interface SkyStackingContext {
  // The z-index to use for the stacking context.
  zIndex: Observable<number>;
}
