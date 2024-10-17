import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  host: {
    '[style.display]': '"block"',
  },
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'app-with-breakpoint-directive',
  standalone: true,
  template: '<ng-content />',
})
export class WithBreakpointDirectiveComponent {}

@Component({
  selector: 'app-breakpoint-reader',
  standalone: true,
  template: `{{ breakpoint() }}<ng-content select="app-breakpoint-reader" />`,
})
export class BreakpointReaderComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}

@Component({
  imports: [
    BreakpointReaderComponent,
    CommonModule,
    SkyResponsiveHostDirective,
    SkyFluidGridModule,
    WithBreakpointDirectiveComponent,
  ],
  standalone: true,
  template: `
    <p>Root breakpoint: {{ rootBreakpoint() }}</p>
    <sky-fluid-grid>
      <sky-row>
        <sky-column [screenXSmall]="6" style="border: 1px solid magenta">
          HTML directive:
          <div
            #observer="skyContainerBreakpointObserver"
            skyContainerBreakpointObserver
          >
            @if ((observer.breakpointChange | async) === 'xs') {
              <div style="color:red;">Mobile view!</div>
            }

            <app-breakpoint-reader />
          </div>
        </sky-column>
        <sky-column [screenXSmall]="6" style="border: 1px solid green">
          Host directive:
          <app-with-breakpoint-directive>
            <app-breakpoint-reader />
          </app-with-breakpoint-directive>
        </sky-column>
      </sky-row>
    </sky-fluid-grid>
  `,
})
export default class SkyMediaQueryPlaygroundComponent {
  protected rootBreakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
