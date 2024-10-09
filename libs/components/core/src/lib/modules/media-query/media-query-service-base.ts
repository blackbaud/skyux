import { Subscription } from 'rxjs';

import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

/**
 * @internal
 */
export abstract class SkyMediaQueryServiceBase {
  public abstract get current(): SkyMediaBreakpoints;
  public abstract destroy(): void;
  public abstract subscribe(listener: SkyMediaQueryListener): Subscription;
}
