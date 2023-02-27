import { Observable } from 'rxjs';

export interface SkyStackingContextConfig {
  // The z-index to use for the stacking context.
  zIndex: Observable<number>;
}
