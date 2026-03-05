import { Component, ErrorHandler, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationTransitionHandler } from './transition-handler';

@Component({
  hostDirectives: [
    {
      directive: _SkyAnimationTransitionHandler,
      inputs: ['transitionSignal: trigger'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-test',
  template: '<span class="sky-test-child"></span>',
})
class TestComponent {}

describe('SkyAnimationTransitionHandler', () => {
  let errorHandlerSpy: jasmine.Spy;

  function setupTest(options?: {
    noopAnimations?: boolean;
    trackProperty?: string;
  }): { fixture: ComponentFixture<TestComponent>; component: TestComponent } {
    const mockErrorHandler = jasmine.createSpyObj('ErrorHandler', [
      'handleError',
    ]);

    errorHandlerSpy = mockErrorHandler.handleError;

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: ErrorHandler, useValue: mockErrorHandler },
        ...(options?.noopAnimations ? [provideNoopSkyAnimations()] : []),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('trigger', signal(false));
    fixture.detectChanges();

    if (options?.trackProperty) {
      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandler,
      );

      handler.cssPropertyToTrack(options.trackProperty);
    }

    return { fixture, component: fixture.componentInstance };
  }

  afterEach(() => {
    document.body.classList.remove('sky-animations-disabled');
  });

  it('should create the directive', () => {
    const { fixture } = setupTest();

    const handler = fixture.debugElement.injector.get(
      _SkyAnimationTransitionHandler,
    );

    expect(handler).toBeTruthy();
  });

  describe('onTransitionEnd', () => {
    it('should throw when no CSS property has been specified', () => {
      const { fixture } = setupTest();

      const evt = new TransitionEvent('transitionend', {
        propertyName: 'opacity',
      });

      fixture.nativeElement.dispatchEvent(evt);

      expect(errorHandlerSpy).toHaveBeenCalledTimes(1);

      const error = errorHandlerSpy.calls.mostRecent().args[0];

      expect(error.message).toMatch(
        /No CSS property specified for transition tracking/,
      );
    });

    it('should include the element tag name in the error', () => {
      const { fixture } = setupTest();

      const evt = new TransitionEvent('transitionend', {
        propertyName: 'opacity',
      });

      fixture.nativeElement.dispatchEvent(evt);

      const error = errorHandlerSpy.calls.mostRecent().args[0];

      expect(error.message).toContain(
        `'<${fixture.nativeElement.tagName.toLowerCase()}>'`,
      );
    });

    it('should emit transitionEnd when the tracked property transitions on the host element', () => {
      const { fixture } = setupTest({ trackProperty: 'opacity' });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandler,
      );

      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      const evt = new TransitionEvent('transitionend', {
        propertyName: 'opacity',
      });

      Object.defineProperty(evt, 'currentTarget', {
        value: fixture.nativeElement,
      });

      fixture.nativeElement.dispatchEvent(evt);

      expect(transitionEndEmitted).toBeTrue();
    });

    it('should not emit transitionEnd when a different property transitions', () => {
      const { fixture } = setupTest({ trackProperty: 'opacity' });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandler,
      );

      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      const evt = new TransitionEvent('transitionend', {
        propertyName: 'transform',
      });

      Object.defineProperty(evt, 'currentTarget', {
        value: fixture.nativeElement,
      });

      fixture.nativeElement.dispatchEvent(evt);

      expect(transitionEndEmitted).toBeFalse();
    });
  });

  describe('when animations are disabled', () => {
    it('should emit transitionEnd synchronously when the transitionSignal changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandler,
      );
      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      // Change the input to a new signal to trigger the effect.
      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      expect(transitionEndEmitted).toBeTrue();
    });
  });
});
