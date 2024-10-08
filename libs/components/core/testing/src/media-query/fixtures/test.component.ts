/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyMediaQueryService } from '@skyux/core';
import { SkySearchModule } from '@skyux/lookup';

@Component({
  selector: 'sky-foo-wrapper',
  standalone: true,
  template: '<ng-content />',
  host: {
    '[class]': '"breakpoint-" + querySvc.current',
    'data-sky-id': 'foo-el',
  },
  // Override the environment provider with an element provider.
  providers: [SkyMediaQueryService],
})
// Use lambda to communicate this component is internal and should not be pulled
// into the spec directly.
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
      <h1>Foobar</h1>

      <!-- Search will use the element injector of the wrapper -->
      <sky-search />
    </sky-foo-wrapper>
  `,
})
export class TestComponent {
  protected querySvc = inject(SkyMediaQueryService);

  constructor() {
    this.querySvc.subscribe((x) => {
      console.log('current', x, this.querySvc);
    });
  }
}

// TODO: This removes the "container query" override from the wrapper for testing.
// ? What are the implications of this?
export function overrideWrapperForTesting(): void {
  TestBed.overrideComponent(λFooTestComponent, {
    remove: {
      providers: [SkyMediaQueryService],
    },
  });
}
