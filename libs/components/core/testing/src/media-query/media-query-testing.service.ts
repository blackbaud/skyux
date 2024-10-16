// /* eslint-disable @nx/enforce-module-boundaries */
// import { Injectable, OnDestroy } from '@angular/core';
// import {
//   SKY_MEDIA_BREAKPOINT_DEFAULT,
//   SkyBreakpointType,
//   SkyMediaBreakpoints,
//   SkyMediaQueryListener,
//   SkyMediaQueryServiceInterface,
//   toSkyMediaBreakpoints,
// } from '@skyux/core';

// import {
//   BehaviorSubject,
//   Observable,
//   ReplaySubject,
//   Subscription,
//   firstValueFrom,
// } from 'rxjs';

// import { SkyMediaQueryTestingControllerInterface } from './media-query-testing-controller-interface';

// /**
//  * @internal
//  */
// @Injectable()
// export class SkyMediaQueryTestingService
//   implements
//     SkyMediaQueryServiceInterface,
//     SkyMediaQueryTestingControllerInterface,
//     OnDestroy
// {
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

//   public ngOnDestroy(): void {
//     this.destroy();
//   }

//   public destroy(): void {
//     this.#currentSubject.complete();
//     this.#breakpointChange.complete();
//   }

//   public async expectBreakpoint(
//     expectedBreakpoint: SkyBreakpointType,
//   ): Promise<void> {
//     if (!this.#breakpoint) {
//       throw new Error(
//         `A media breakpoint has not been set. Call \`setBreakpoint()\` and try again.`,
//       );
//     }

//     const current = await firstValueFrom(this.#breakpointChange);

//     if (expectedBreakpoint !== current) {
//       throw new Error(
//         `Expected the current media breakpoint to be "${expectedBreakpoint}", but it is "${current}".`,
//       );
//     }
//   }

//   public setBreakpoint(breakpoint: SkyBreakpointType): void {
//     const breakpointLegacy = toSkyMediaBreakpoints(breakpoint);

//     this.#currentBreakpoint = breakpointLegacy;
//     this.#currentSubject.next(breakpointLegacy);

//     if (this.#breakpoint !== breakpoint) {
//       this.#breakpoint = breakpoint;
//       this.#breakpointChange.next(breakpoint);
//     }
//   }

//   public subscribe(listener: SkyMediaQueryListener): Subscription {
//     return this.#currentSubject.subscribe({
//       next: (breakpoint) => {
//         listener(breakpoint);
//       },
//     });
//   }
// }
