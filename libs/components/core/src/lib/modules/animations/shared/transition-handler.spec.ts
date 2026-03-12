import { Component, ErrorHandler, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationTransitionHandlerDirective } from './transition-handler';

@Component({
  hostDirectives: [
    {
      directive: _SkyAnimationTransitionHandlerDirective,
      inputs: ['transitionTrigger: trigger'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-test',
  template: '<span class="sky-test-child"></span>',
})
class TestComponent {}

@Component({
  imports: [_SkyAnimationTransitionHandlerDirective],
  selector: 'sky-test-template',
  template: `
    <div
      skyAnimationTransitionHandler
      [transitionPropertyToTrack]="propertyToTrack()"
      [transitionTrigger]="trigger()"
      (transitionEnd)="onTransitionEnd()"
    ></div>
  `,
})
class TemplateTestComponent {
  public readonly propertyToTrack = input<string>();
  public readonly trigger = input<boolean>(false);
  public transitionEndEmitted = false;

  protected onTransitionEnd(): void {
    this.transitionEndEmitted = true;
  }
}

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
    fixture.componentRef.setInput('trigger', false);
    fixture.detectChanges();

    if (options?.trackProperty) {
      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandlerDirective,
      );

      handler.setPropertyToTrack(options.trackProperty);
    }

    return { fixture, component: fixture.componentInstance };
  }

  afterEach(() => {
    document.body.classList.remove('sky-animations-disabled');
  });

  it('should create the directive', () => {
    const { fixture } = setupTest();

    const handler = fixture.debugElement.injector.get(
      _SkyAnimationTransitionHandlerDirective,
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
        _SkyAnimationTransitionHandlerDirective,
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
        _SkyAnimationTransitionHandlerDirective,
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

    it('should ignore transitionend events that bubble from child elements', () => {
      const { fixture } = setupTest();

      const child = fixture.nativeElement.querySelector('.sky-test-child');

      const evt = new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'opacity',
      });

      child.dispatchEvent(evt);

      expect(errorHandlerSpy).not.toHaveBeenCalled();
    });
  });

  describe('when animations are disabled', () => {
    it('should not emit transitionEnd on initial render when trigger starts falsy', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandlerDirective,
      );
      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      fixture.detectChanges();

      expect(transitionEndEmitted).toBeFalse();
    });

    it('should emit transitionEnd on initial render when trigger starts truthy', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandlerDirective,
      );

      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      fixture.componentRef.setInput('trigger', true);
      fixture.detectChanges();

      expect(transitionEndEmitted).toBeTrue();
    });

    it('should emit transitionEnd synchronously when the transitionTrigger changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationTransitionHandlerDirective,
      );
      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      fixture.componentRef.setInput('trigger', true);
      fixture.detectChanges();

      expect(transitionEndEmitted).toBeTrue();
    });
  });

  describe('transitionPropertyToTrack input', () => {
    function setupTemplateTest(options?: {
      noopAnimations?: boolean;
    }): ComponentFixture<TemplateTestComponent> {
      TestBed.configureTestingModule({
        imports: [TemplateTestComponent],
        providers: [
          ...(options?.noopAnimations ? [provideNoopSkyAnimations()] : []),
        ],
      });

      const fixture = TestBed.createComponent(TemplateTestComponent);
      fixture.componentRef.setInput('propertyToTrack', 'opacity');
      fixture.detectChanges();

      return fixture;
    }

    function getDirectiveHost(
      fixture: ComponentFixture<TemplateTestComponent>,
    ): HTMLElement {
      return fixture.nativeElement.querySelector(
        '[skyAnimationTransitionHandler]',
      );
    }

    it('should emit transitionEnd when the tracked property transitions', () => {
      const fixture = setupTemplateTest();
      const host = getDirectiveHost(fixture);

      host.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'opacity' }),
      );

      expect(fixture.componentInstance.transitionEndEmitted).toBeTrue();
    });

    it('should not emit transitionEnd when a different property transitions', () => {
      const fixture = setupTemplateTest();
      const host = getDirectiveHost(fixture);

      host.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'transform' }),
      );

      expect(fixture.componentInstance.transitionEndEmitted).toBeFalse();
    });

    it('should take precedence over setPropertyToTrack()', () => {
      const fixture = setupTemplateTest();
      const host = getDirectiveHost(fixture);

      const handler = fixture.debugElement.children[0].injector.get(
        _SkyAnimationTransitionHandlerDirective,
      );

      // Set a different property programmatically.
      handler.setPropertyToTrack('transform');

      // Dispatch a transitionend for the input value ('opacity').
      host.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'opacity' }),
      );

      expect(fixture.componentInstance.transitionEndEmitted).toBeTrue();

      // Reset and verify the programmatic value is ignored.
      fixture.componentInstance.transitionEndEmitted = false;

      host.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'transform' }),
      );

      expect(fixture.componentInstance.transitionEndEmitted).toBeFalse();
    });
  });
});
