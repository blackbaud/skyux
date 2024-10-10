/* eslint-disable @nx/enforce-module-boundaries */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';

import { TestComponent } from './fixtures/test.component';
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

    const wrapper = fixture.debugElement.query(By.css('sky-foo-wrapper'));
    const child = fixture.debugElement.query(By.css('sky-foo-child'));

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.xs);
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.xs);
    expectBreakpointCSSClass(wrapper.nativeElement, SkyMediaBreakpoints.xs);
    expectBreakpointCSSClass(child.nativeElement, SkyMediaBreakpoints.xs);

    mediaQueryController.setBreakpoint(SkyMediaBreakpoints.lg);
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, SkyMediaBreakpoints.lg);
    expectBreakpointCSSClass(wrapper.nativeElement, SkyMediaBreakpoints.lg);
    expectBreakpointCSSClass(child.nativeElement, SkyMediaBreakpoints.lg);
  });
});
