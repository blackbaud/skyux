import { Subscription } from 'rxjs';

import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

/**
 * @internal
 */
export interface SkyMediaQueryServiceBase {
  get current(): SkyMediaBreakpoints;
  destroy(): void;
  subscribe(listener: SkyMediaQueryListener): Subscription;
}
