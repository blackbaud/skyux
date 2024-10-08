/* eslint-disable @nx/enforce-module-boundaries */
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyMediaBreakpoints } from '@skyux/core';
import { SkySearchHarness } from '@skyux/lookup/testing';

import {
  TestComponent,
  overrideWrapperForTesting,
} from './fixtures/test.component';
import { SkyMediaQueryTestingController } from './media-query-testing.controller';
import { provideSkyMediaQueryTesting } from './provide-media-query-testing';

fdescribe('media-query-testing.controller', () => {
  function expectBreakpointCSSClass(
    el: HTMLElement,
    breakpoint: SkyMediaBreakpoints,
  ): void {
    expect(el.className).toEqual(`breakpoint-${breakpoint}`);
  }

  function setupTest(options?: { overrideComponent: Type<unknown> }): {
    elementMediaQueryController: SkyMediaQueryTestingController;
    fixture: ComponentFixture<TestComponent>;
    mediaQueryController: SkyMediaQueryTestingController;
    wrapperMediaQueryController: SkyMediaQueryTestingController;
  } {
    if (options?.overrideComponent) {
      TestBed.overrideComponent(options.overrideComponent, {
        add: {
          providers: [provideSkyMediaQueryTesting()],
        },
      });
    }

    const fixture = TestBed.createComponent(TestComponent);

    const mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);

    // TODO: We need a way to override this component's providers in order to
    // let consumers trigger the media query change. But should we?
    const wrapperMediaQueryController = fixture.debugElement
      .query(By.css('sky-foo-wrapper'))
      .injector.get(SkyMediaQueryTestingController);

    const elementMediaQueryController = fixture.debugElement.injector.get(
      SkyMediaQueryTestingController,
      undefined,
      { skipSelf: true },
    );

    return {
      elementMediaQueryController,
      fixture,
      mediaQueryController,
      wrapperMediaQueryController,
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    overrideWrapperForTesting();
  });

  fit('should trigger media query breakpoints', () => {
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

  fit('should work with overridden providers', async () => {
    const {
      elementMediaQueryController,
      fixture,
      mediaQueryController,
      wrapperMediaQueryController,
    } = setupTest();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const searchHarness = await loader.getHarness(SkySearchHarness);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    // elementMediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    // wrapperMediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    await fixture.whenStable();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.xs);
    await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(true);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    elementMediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    wrapperMediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    fixture.detectChanges();
    await fixture.whenStable();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.lg);
    await expectAsync(searchHarness.isCollapsed()).toBeResolvedTo(false);
  });
});
