import { Observable } from 'rxjs';

import { SkyBreakpointType } from './breakpoint-type';

/**
 * @internal
 */
export interface SkyBreakpointObserver {
  get breakpointChange(): Observable<SkyBreakpointType>;
  destroy(): void;
}
