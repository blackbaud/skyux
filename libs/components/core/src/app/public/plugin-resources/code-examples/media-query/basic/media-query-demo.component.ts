import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  Subscription
} from 'rxjs';

@Component({
  selector: 'app-media-query-demo',
  templateUrl: './media-query-demo.component.html'
})
export class MediaQueryDemoComponent implements OnDestroy {

  public currentBreakpoint: string;

  private querySubscription: Subscription;

  constructor(
    private mediaQueries: SkyMediaQueryService
  ) {
    this.querySubscription = this.mediaQueries.subscribe((newBreakpoint: SkyMediaBreakpoints) => {
      switch (newBreakpoint) {
        case SkyMediaBreakpoints.xs:
          this.currentBreakpoint = 'xs';
          break;
        case SkyMediaBreakpoints.sm:
          this.currentBreakpoint = 'sm';
          break;
        case SkyMediaBreakpoints.md:
          this.currentBreakpoint = 'md';
          break;
        case SkyMediaBreakpoints.lg:
          this.currentBreakpoint = 'lg';
          break;
        default:
          this.currentBreakpoint = 'unknown';
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }
}
