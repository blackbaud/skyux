/* eslint-disable @nx/enforce-module-boundaries */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { SkySearchHarness } from '@skyux/lookup/testing';

import {
  TestComponent,
  overrideWrapperForTesting,
} from './fixtures/test.component';
import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { provideSkyMediaQueryTesting } from './provide-media-query-testing';

describe('media-query-testing.controller', () => {
  function expectBreakpointCSSClass(
    el: HTMLElement,
    breakpoint: SkyMediaBreakpoints,
  ): void {
    expect(el.className).toEqual(`breakpoint-${breakpoint}`);
  }

  function setupTest(): {
    fixture: ComponentFixture<TestComponent>;
    mediaQueryController: SkyMediaQueryTestingController;
  } {
    const fixture = TestBed.createComponent(TestComponent);
    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    return {
      fixture,
      mediaQueryController,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting(), provideRouter([])],
    });

    // TODO: Don't do this.
    overrideWrapperForTesting();
  });

  it('should trigger media query breakpoints', () => {
    const { fixture, mediaQueryController } = setupTest();

    const el = fixture.nativeElement;

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    expectBreakpointCSSClass(el, SkyMediaBreakpoints.xs);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.sm);
    fixture.detectChanges();
    expectBreakpointCSSClass(el, SkyMediaBreakpoints.sm);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.md);
    fixture.detectChanges();
    expectBreakpointCSSClass(el, SkyMediaBreakpoints.md);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    expectBreakpointCSSClass(el, SkyMediaBreakpoints.lg);
  });

  it('should emit breakpoint changes', () => {
    const { mediaQueryController } = setupTest();

    let currentBreakpoint: SkyMediaBreakpoints | undefined;
    const subscription = TestBed.inject(SkyMediaQueryService).subscribe(
      (breakpoint) => {
        currentBreakpoint = breakpoint;
      },
    );

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.lg);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.xs);

    subscription.unsubscribe();
  });

  it('should work with overridden providers', async () => {
    const { fixture, mediaQueryController } = setupTest();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const searchHarness = await loader.getHarness(SkySearchHarness);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    await fixture.whenStable();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.xs);
    await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(true);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    await fixture.whenStable();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.lg);
    await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(false);
  });
});
