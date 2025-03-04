import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { FontLoadingService } from '@skyux/storybook/font-loading';

@Component({
  selector: 'app-flyout-responsive',
  templateUrl: './flyout-responsive.component.html',
  styleUrls: ['./flyout-responsive.component.scss'],
  standalone: false,
})
export class FlyoutResponsiveComponent {
  public currentMediaBreakpoint: 'xs' | 'sm' | 'md' | 'lg' = 'lg';
  protected ready = toSignal(inject(FontLoadingService).ready(true));

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
