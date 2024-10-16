// import {
//   SKY_MEDIA_BREAKPOINT_DEFAULT,
//   SkyBreakpointType,
//   SkyMediaBreakpoints,
// } from '@skyux/core';

// import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

// export class SkyMediaQueryTestingServiceBase {
//   public get breakpointChange(): Observable<SkyBreakpointType> {
//     return this.#breakpointChangeObs;
//   }

//   public get current(): SkyMediaBreakpoints {
//     return this.#currentBreakpoint;
//   }

//   #breakpoint: SkyBreakpointType | undefined;
//   #breakpointChange = new ReplaySubject<SkyBreakpointType>(1);
//   #breakpointChangeObs = this.#breakpointChange.asObservable();

//   #currentBreakpoint = SKY_MEDIA_BREAKPOINT_DEFAULT;
//   #currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(
//     SKY_MEDIA_BREAKPOINT_DEFAULT,
//   );
// }
