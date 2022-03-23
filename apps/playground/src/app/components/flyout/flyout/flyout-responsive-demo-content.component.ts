import { Component } from '@angular/core';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-flyout-responsive-demo-content',
  templateUrl: './flyout-responsive-demo-content.component.html',
  styleUrls: ['./flyout-responsive-demo-content.component.scss'],
})
export class FlyoutResponsiveDemoContentComponent {
  public currentMediaBreakpoint: string;

  constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe((breakpoint) => {
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
