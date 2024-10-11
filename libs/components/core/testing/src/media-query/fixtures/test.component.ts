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
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
  provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

/**
 * This component simulates a SKY UX component that has provided the media
 * query service as a class provider.
 */
@Component({
  host: {
    '[class]': '"breakpoint-" + breakpointChange()',
  },
  imports: [CommonModule],
  selector: 'sky-foo-wrapper',
  standalone: true,
  template: `
    <div #wrapperRef data-sky-id="my-resize-wrapper">
      <ng-content />
    </div>
  `,
  providers: [
    // Override the environment provider with an element provider.
    provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
// Use lambda to simulate a component not included in the public API.
export class λWrapperTestComponent implements OnInit, OnDestroy {
  @ViewChild('wrapperRef', { static: true })
  protected wrapperRef!: ElementRef;

  protected querySvc = inject(
    SkyMediaQueryService,
  ) as unknown as SkyResizeObserverMediaQueryService;

  protected breakpointChange = toSignal(this.querySvc.breakpointChange);

  public ngOnInit(): void {
    this.querySvc.observe(this.wrapperRef, { updateResponsiveClasses: true });
  }

  public ngOnDestroy(): void {
    this.querySvc.unobserve();
  }
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
