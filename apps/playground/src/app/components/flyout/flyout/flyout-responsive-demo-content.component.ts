import { Component, OnDestroy } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flyout-responsive-demo-content',
  templateUrl: './flyout-responsive-demo-content.component.html',
  styleUrls: ['./flyout-responsive-demo-content.component.scss'],
  standalone: false,
})
export class FlyoutResponsiveDemoContentComponent implements OnDestroy {
  public currentMediaBreakpoint: string;

  #mediaQueryService: SkyMediaQueryService;
  #mediaQuerySubscription: Subscription;

  constructor(mediaQueryService: SkyMediaQueryService) {
    this.#mediaQueryService = mediaQueryService;

    this.#mediaQuerySubscription = this.#mediaQueryService.subscribe(
      (breakpoint) => {
        switch (breakpoint) {
          case SkyMediaBreakpoints.xs: {
            this.currentMediaBreakpoint = 'xs';
            break;
          }
          case SkyMediaBreakpoints.sm: {
            this.currentMediaBreakpoint = 'sm';
            break;
          }
          case SkyMediaBreakpoints.md: {
            this.currentMediaBreakpoint = 'md';
            break;
          }
          default: {
            this.currentMediaBreakpoint = 'lg';
            break;
          }
        }
      },
    );
  }

  public ngOnDestroy(): void {
    this.#mediaQuerySubscription.unsubscribe();
  }
}
