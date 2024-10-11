import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkyAlertModule } from '@skyux/indicators';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyAlertModule],
})
export class DemoComponent {
  protected currentBreakpoint: string | undefined;

  constructor() {
    inject(SkyMediaQueryService)
      .breakpointChange.pipe(takeUntilDestroyed())
      .subscribe((breakpoint) => {
        switch (breakpoint) {
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
}
