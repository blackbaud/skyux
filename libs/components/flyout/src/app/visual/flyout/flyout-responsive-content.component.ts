import {
  Component
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

@Component({
  selector: 'sky-flyout-responsive-content',
  templateUrl: './flyout-responsive-content.component.html',
  styleUrls: ['./flyout-responsive-content.component.scss']
})
export class SkyFlyoutResponsiveContentComponent {

  public currentMediaBreakpoint: string;

  constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe(breakpoint => {
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
