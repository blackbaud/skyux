import { Component } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-flyout-responsive',
  templateUrl: './flyout-responsive.component.html',
  styleUrls: ['./flyout-responsive.component.scss'],
})
export class FlyoutResponsiveComponent {
  public currentMediaBreakpoint: 'xs' | 'sm' | 'md' | 'lg' = 'lg';

  constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe((breakpoint) => {
      console.log(breakpoint);
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
    });
  }
}
