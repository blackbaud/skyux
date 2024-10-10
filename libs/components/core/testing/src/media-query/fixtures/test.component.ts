/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, Injectable, inject } from '@angular/core';
import {
  SkyMediaQueryService,
  provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

@Injectable()
class MyMediaQueryService extends SkyMediaQueryService {}

/**
 * This component simulates a SKY UX component that has provided the media
 * query service as a class provider.
 */
@Component({
  host: {
    '[class]': '"breakpoint-" + querySvc.current',
  },
  selector: 'sky-foo-wrapper',
  standalone: true,
  template: '<ng-content />',
  providers: [
    // Override the environment provider with an element provider.
    provideSkyMediaQueryServiceOverride(MyMediaQueryService),
  ],
})
// Use lambda to simulate a component not included in the public API.
export class λWrapperTestComponent {
  protected querySvc = inject(SkyMediaQueryService);
}

@Component({
  host: {
    '[class]': '"breakpoint-" + querySvc.current',
  },
  selector: 'sky-foo-child',
  standalone: true,
  template: '',
})
export class λChildTestComponent {
  protected querySvc = inject(SkyMediaQueryService);
}

@Component({
  host: {
    '[class]': '"breakpoint-" + querySvc.current',
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
  protected querySvc = inject(SkyMediaQueryService);
}
