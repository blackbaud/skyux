/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyContainerQueryDirective, SkyMediaQueryService } from '@skyux/core';

/**
 * This component simulates a SKY UX component that has provided the media
 * query service as a class provider.
 */
@Component({
  host: {
    '[class]': '"breakpoint-" + breakpointChange()',
  },
  hostDirectives: [SkyContainerQueryDirective],
  imports: [CommonModule],
  selector: 'sky-foo-wrapper',
  standalone: true,
  template: ` <ng-content /> `,
  providers: [],
})
export class λWrapperTestComponent {
  readonly #querySvc = inject(SkyMediaQueryService);

  protected breakpointChange = toSignal(this.#querySvc.breakpointChange);
}

@Component({
  host: {
    '[class]': '"breakpoint-" + breakpointChange()',
  },
  selector: 'sky-foo-child',
  standalone: true,
  template: '',
})
export class λChildTestComponent {
  protected breakpointChange = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}

@Component({
  host: {
    '[class]': '"breakpoint-" + breakpointChange()',
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
  protected breakpointChange = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
