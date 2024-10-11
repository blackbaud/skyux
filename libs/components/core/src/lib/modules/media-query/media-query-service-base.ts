import { Observable, Subscription } from 'rxjs';

import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

/**
 * @internal
 */
export interface SkyMediaQueryServiceBase {
  /**
   * Emits when the breakpoint changes.
   */
  get breakpointChange(): Observable<SkyMediaBreakpoints>;

  /**
   * Returns the current breakpoint.
   */
  get current(): SkyMediaBreakpoints;

  /**
   * @internal
   */
  destroy(): void;

  /**
   * Subscribes to screen size changes.
   * @param listener Specifies a function that is called when breakpoints change.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
   */
  subscribe(listener: SkyMediaQueryListener): Subscription;
}
