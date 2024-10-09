/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyMediaQueryService } from '@skyux/core';
import { SkySearchModule } from '@skyux/lookup';

import { provideSkyMediaQueryTesting } from '../provide-media-query-testing';

/**
 * This component simulates a SKY UX component that has provided the media
 * query service as a class provider.
 */
@Component({
  selector: 'sky-foo-wrapper',
  standalone: true,
  template: '<ng-content />',
  // Override the environment provider with an element provider.
  providers: [SkyMediaQueryService],
})
// Use lambda to simulate an internal SKY UX component.
export class λFooTestComponent {
  protected querySvc = inject(SkyMediaQueryService);
}

@Component({
  host: {
    '[class]': '"breakpoint-" + querySvc.current',
  },
  imports: [λFooTestComponent, CommonModule, SkySearchModule],
  standalone: true,
  template: `
    <sky-foo-wrapper>
      <!-- Search will use the element injector of the wrapper -->
      <sky-search />
    </sky-foo-wrapper>
  `,
})
export class TestComponent {
  protected querySvc = inject(SkyMediaQueryService);
}

// Override the internal component's providers.
// TODO: We can't do this for our components because they're not exported to the public API.
export function overrideWrapperForTesting(): void {
  TestBed.overrideComponent(λFooTestComponent, {
    add: {
      providers: [provideSkyMediaQueryTesting()],
    },
  });
}
