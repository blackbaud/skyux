import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService, SkyResponsiveHostDirective } from '@skyux/core';
import { SkyFluidGridModule } from '@skyux/layout';

@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'app-with-breakpoint-directive',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
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
  template: `
    <p>Root breakpoint: {{ rootBreakpoint() }}</p>
    <sky-fluid-grid>
      <sky-row>
        <sky-column style="border: 1px solid magenta" [screenXSmall]="6">
          HTML directive:
          <div #observer="skyResponsiveHost" skyResponsiveHost>
            @if ((observer.breakpointChange | async) === 'xs') {
              <div style="color:red;">Mobile view!</div>
            }
            <app-breakpoint-reader />
          </div>
        </sky-column>
        <sky-column style="border: 1px solid green" [screenXSmall]="6">
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
