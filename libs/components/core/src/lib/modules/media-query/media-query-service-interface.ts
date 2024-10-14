import { Observable, Subscription } from 'rxjs';

import { SkyMediaBreakpointType } from './media-breakpoint-type';
import { SkyMediaBreakpoints } from './media-breakpoints';
import { SkyMediaQueryListener } from './media-query-listener';

/**
 * @internal
 */
export interface SkyMediaQueryServiceInterface {
  /**
   * Emits when the breakpoint changes.
   */
  get breakpointChange(): Observable<SkyMediaBreakpointType>;

  /**
   * Returns the current breakpoint.
   * @deprecated Subscribe to the `breakpointChange` observable instead.
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
