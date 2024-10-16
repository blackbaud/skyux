/* eslint-disable @nx/enforce-module-boundaries */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  SkyBreakpointType,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { TestComponent } from './fixtures/test.component';
import { SkyMediaQueryTestingController } from './media-query-testing-controller';
import { provideSkyMediaQueryTesting } from './provide-media-query-testing';

describe('media-query-testing.controller', () => {
  function expectBreakpointCSSClass(
    el: HTMLElement,
    breakpoint: SkyBreakpointType,
  ): void {
    expect(el).toHaveClass(`breakpoint-${breakpoint}`);
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

    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();
    expectBreakpointCSSClass(el, 'xs');

    mediaQueryController.setBreakpoint('sm');
    fixture.detectChanges();
    expectBreakpointCSSClass(el, 'sm');

    mediaQueryController.setBreakpoint('md');
    fixture.detectChanges();
    expectBreakpointCSSClass(el, 'md');

    mediaQueryController.setBreakpoint('lg');
    fixture.detectChanges();
    expectBreakpointCSSClass(el, 'lg');
  });

  it('should emit breakpoint changes (legacy)', () => {
    const { mediaQueryController } = setupTest();

    let currentBreakpoint: SkyMediaBreakpoints | undefined;
    const subscription = TestBed.inject(SkyMediaQueryService).subscribe(
      (breakpoint) => {
        currentBreakpoint = breakpoint;
      },
    );

    mediaQueryController.setBreakpoint('lg');
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.lg);

    mediaQueryController.setBreakpoint('xs');
    expect(currentBreakpoint).toEqual(SkyMediaBreakpoints.xs);

    subscription.unsubscribe();
  });

  it('should emit breakpoint changes', () => {
    const { mediaQueryController } = setupTest();

    let currentBreakpoint: SkyBreakpointType | undefined;

    const subscription = TestBed.inject(
      SkyMediaQueryService,
    ).breakpointChange.subscribe((breakpoint) => {
      currentBreakpoint = breakpoint;
    });

    mediaQueryController.setBreakpoint('lg');
    expect(currentBreakpoint).toEqual('lg');

    mediaQueryController.setBreakpoint('xs');
    expect(currentBreakpoint).toEqual('xs');

    subscription.unsubscribe();
  });

  it('should expect current breakpoint', async () => {
    const { mediaQueryController } = setupTest();

    await expectAsync(
      mediaQueryController.expectBreakpoint('md'),
    ).toBeRejectedWithError(
      'A media breakpoint has not been set. Call `setBreakpoint()` and try again.',
    );

    mediaQueryController.setBreakpoint('lg');
    await mediaQueryController.expectBreakpoint('lg');

    expect(TestBed.inject(SkyMediaQueryService).current).toEqual(
      SkyMediaBreakpoints.lg,
    );
  });

  it('should throw when expecting the wrong breakpoint', async () => {
    const { mediaQueryController } = setupTest();

    mediaQueryController.setBreakpoint('lg');

    await expectAsync(
      mediaQueryController.expectBreakpoint('sm'),
    ).toBeRejectedWithError(
      'Expected the current media breakpoint to be "sm", but it is "lg".',
    );
  });

  it('should work with overridden providers', () => {
    const { fixture, mediaQueryController } = setupTest();

    const wrapper = fixture.debugElement.query(By.css('sky-foo-wrapper'));
    // const wrapperDiv = wrapper.nativeElement.querySelector(
    //   '[data-sky-id="my-resize-wrapper"]',
    // );
    const child = fixture.debugElement.query(By.css('sky-foo-child'));

    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, 'xs');
    expectBreakpointCSSClass(wrapper.nativeElement, 'xs');
    expect(wrapper.nativeElement).toHaveClass('sky-responsive-container-xs');
    // expect(wrapperDiv).toHaveClass('sky-responsive-container-xs');
    expectBreakpointCSSClass(child.nativeElement, 'xs');

    mediaQueryController.setBreakpoint('lg');
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, 'lg');
    expectBreakpointCSSClass(wrapper.nativeElement, 'lg');
    // expect(wrapperDiv).toHaveClass('sky-responsive-container-lg');
    expectBreakpointCSSClass(child.nativeElement, 'lg');
  });
});
