import {
  Injectable,
  NgZone,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Subscription
} from 'rxjs';

import {
  SkyMediaBreakpoints
} from './media-breakpoints';

import {
  SkyMediaQueryListener
} from './media-query-listener';

@Injectable()
export class SkyMediaQueryService implements OnDestroy {
  public static xs = '(max-width: 767px)';
  public static sm = '(min-width: 768px) and (max-width: 991px)';
  public static md = '(min-width: 992px) and (max-width: 1199px)';
  public static lg = '(min-width: 1200px)';

  public get current(): SkyMediaBreakpoints {
    return this._current;
  }

  private currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.current);

  private _current = SkyMediaBreakpoints.md;

  private breakpoints: {
    mediaQueryString: string,
    name: SkyMediaBreakpoints
  }[] = [
    {
      mediaQueryString: SkyMediaQueryService.xs,
      name: SkyMediaBreakpoints.xs
    },
    {
      mediaQueryString: SkyMediaQueryService.sm,
      name: SkyMediaBreakpoints.sm
    },
    {
      mediaQueryString: SkyMediaQueryService.md,
      name: SkyMediaBreakpoints.md
    },
    {
      mediaQueryString: SkyMediaQueryService.lg,
      name: SkyMediaBreakpoints.lg
    }
  ];

  private mediaQueries: {
    mediaQueryList: MediaQueryList,
    listener: ((event: any) => void)
  }[] = [];

  constructor(
    private zone: NgZone
  ) {
    this.addListeners();
  }

  public ngOnDestroy(): void {
    this.removeListeners();
    this.currentSubject.complete();
  }

  public subscribe(listener: SkyMediaQueryListener): Subscription {
    return this.currentSubject.subscribe({
      next: (breakpoints: SkyMediaBreakpoints) => {
        listener(breakpoints);
      }
    });
  }

  public destroy(): void {
    this.removeListeners();
    this.currentSubject.complete();
  }

  private addListeners(): void {
    this.mediaQueries = this.breakpoints.map((breakpoint: any) => {
      const mq = matchMedia(breakpoint.mediaQueryString);

      const listener = (event: any) => {
        // Run the check outside of Angular's change detection since Angular
        // does not wrap matchMedia listeners in NgZone.
        // See: https://blog.assaf.co/angular-2-change-detection-zones-and-an-example/
        this.zone.run(() => {
          if (event.matches) {
            this.notifyBreakpointChange(breakpoint.name);
          }
        });
      };

      mq.addListener(listener);

      if (mq.matches) {
        this.notifyBreakpointChange(breakpoint.name);
      }

      return {
        mediaQueryList: mq,
        listener
      };
    });
  }

  private removeListeners(): void {
    this.mediaQueries.forEach((mediaQuery) => {
      mediaQuery.mediaQueryList.removeListener(mediaQuery.listener);
    });
    this.mediaQueries = [];
  }

  private notifyBreakpointChange(breakpoint: SkyMediaBreakpoints): void {
    this._current = breakpoint;
    this.currentSubject.next(breakpoint);
  }
}
