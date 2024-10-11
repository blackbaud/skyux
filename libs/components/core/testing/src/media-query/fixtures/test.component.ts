/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
  _provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

export const BREAKPOINT_NAMES = new Map<SkyMediaBreakpoints, string>([
  [SkyMediaBreakpoints.lg, 'lg'],
  [SkyMediaBreakpoints.md, 'md'],
  [SkyMediaBreakpoints.sm, 'sm'],
  [SkyMediaBreakpoints.xs, 'xs'],
]);

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
  template: `
    <div #wrapperRef data-sky-id="my-resize-wrapper">
      <ng-content />
    </div>
  `,
  providers: [
    // Override the environment provider with an element provider.
    _provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
// Use lambda to simulate a component not included in the public API.
export class λWrapperTestComponent implements OnInit, OnDestroy {
  @ViewChild('wrapperRef', { static: true })
  protected wrapperRef!: ElementRef;

  protected querySvc = inject(
    SkyMediaQueryService,
  ) as unknown as SkyResizeObserverMediaQueryService;

  public ngOnInit(): void {
    this.querySvc.observe(this.wrapperRef, { updateResponsiveClasses: true });
  }

  public ngOnDestroy(): void {
    this.querySvc.unobserve();
  }
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
