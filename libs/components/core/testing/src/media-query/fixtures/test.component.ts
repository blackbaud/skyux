/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService, SkyResponsiveHostDirective } from '@skyux/core';

@Component({
  host: {
    '[class]': '"breakpoint-" + breakpoint()',
  },
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-foo-wrapper',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: '<ng-content />',
})
export class λWrapperTestComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}

@Component({
  host: {
    '[class]': '"breakpoint-" + breakpoint()',
  },
  selector: 'sky-foo-child',
  standalone: true,
  template: '',
})
export class λChildTestComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}

@Component({
  host: {
    '[class]': '"breakpoint-" + breakpoint()',
  },
  imports: [λChildTestComponent, λWrapperTestComponent, CommonModule],
  standalone: true,
  template: `
    <sky-foo-wrapper>
      <!-- Children will use the element injector of the wrapper -->
      <sky-foo-child />
    </sky-foo-wrapper>
  `,
})
export class TestComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
