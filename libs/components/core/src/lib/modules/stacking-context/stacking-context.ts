import { Observable } from 'rxjs';

export interface SkyStackingContext {
  // The z-index to use for the stacking context.
  zIndex: Observable<number>;
}
