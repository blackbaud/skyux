import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  SkyBreakpoint,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
} from '@skyux/core';

import { TestComponent } from './fixtures/test.component';
import { SkyMediaQueryTestingController } from './media-query-testing-controller';
import { provideSkyMediaQueryTesting } from './provide-media-query-testing';

describe('media-query-testing.controller', () => {
  function expectBreakpointCSSClass(
    el: HTMLElement,
    breakpoint: SkyBreakpoint,
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

    let currentBreakpoint: SkyBreakpoint | undefined;

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

  it('should work with overridden providers', () => {
    const { fixture, mediaQueryController } = setupTest();

    const wrapper = fixture.debugElement.query(By.css('sky-foo-wrapper'));
    const child = fixture.debugElement.query(By.css('sky-foo-child'));

    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, 'xs');
    expectBreakpointCSSClass(wrapper.nativeElement, 'xs');
    expect(wrapper.nativeElement).toHaveClass('sky-responsive-container-xs');
    expectBreakpointCSSClass(child.nativeElement, 'xs');

    mediaQueryController.setBreakpoint('lg');
    fixture.detectChanges();

    expectBreakpointCSSClass(fixture.nativeElement, 'lg');
    expectBreakpointCSSClass(wrapper.nativeElement, 'lg');
    expectBreakpointCSSClass(child.nativeElement, 'lg');
  });
});
