import {
  Component
} from '@angular/core';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

@Component({
  selector: 'sky-responsive-demo',
  templateUrl: './responsive-demo.component.html',
  styleUrls: ['./responsive-demo.component.scss']
})
export class SkyResponsiveDemoComponent {

  public currentContainerBreakpoint = 'xs';

  public currentScreenBreakpoint: string;

  constructor(private mediaQueryService: SkyMediaQueryService) {
    this.mediaQueryService.subscribe(breakpoint => {
      if (breakpoint === SkyMediaBreakpoints.xs) {
        this.currentScreenBreakpoint = 'xs';
      } else if (breakpoint === SkyMediaBreakpoints.sm) {
        this.currentScreenBreakpoint = 'sm';
      } else if (breakpoint === SkyMediaBreakpoints.md) {
        this.currentScreenBreakpoint = 'md';
      } else if (breakpoint === SkyMediaBreakpoints.lg) {
        this.currentScreenBreakpoint = 'lg';
      }
    });
  }

  public setClass(breakpoint: string) {
    this.currentContainerBreakpoint = breakpoint;
  }

}
