import { Observable } from 'rxjs';

import { SkyBreakpoint } from './breakpoint';

/**
 * @internal
 */
export interface SkyBreakpointObserver {
  get breakpointChange(): Observable<SkyBreakpoint>;
  destroy(): void;
}
