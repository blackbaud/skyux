import { Component, ErrorHandler, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyTransitionEndHandlerDirective } from './transition-handler';

@Component({
  hostDirectives: [
    {
      directive: _SkyTransitionEndHandlerDirective,
      inputs: ['transitionTrigger: trigger'],
      outputs: ['transitionEnd'],
    },
  ],
  selector: 'sky-test',
  template: '<span class="sky-test-child"></span>',
})
class TestComponent {}

@Component({
  imports: [_SkyTransitionEndHandlerDirective],
  selector: 'sky-test-template',
  template: `
    <div
      skyTransitionEndHandler
      [transitionPropertyToTrack]="propertyToTrack()"
      [transitionTrigger]="trigger()"
      (transitionEnd)="onTransitionEnd()"
    ></div>
  `,
})
class TemplateTestComponent {
  public readonly propertyToTrack = input<string>('opacity');
  public readonly trigger = input<unknown>(false);
  public transitionEndEmitted = false;

  protected onTransitionEnd(): void {
    this.transitionEndEmitted = true;
  }
}

describe('SkyTransitionEndHandler', () => {
  function setupTest(options?: {
    noopAnimations?: boolean;
    trackProperty?: string;
    skipTrackProperty?: boolean;
  }): { fixture: ComponentFixture<TestComponent>; component: TestComponent } {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        ...(options?.noopAnimations ? [provideNoopSkyAnimations()] : []),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const handler = fixture.debugElement.injector.get(
      _SkyTransitionEndHandlerDirective,
    );

    if (!options?.skipTrackProperty) {
      handler.setPropertyToTrack(options?.trackProperty ?? 'opacity');
    }

    fixture.componentRef.setInput('trigger', signal(false));
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance };
  }

  afterEach(() => {
    document.body.classList.remove('sky-animations-disabled');
  });

  it('should create the directive', () => {
    const { fixture } = setupTest();

    const handler = fixture.debugElement.injector.get(
      _SkyTransitionEndHandlerDirective,
    );

    expect(handler).toBeTruthy();
  });

  describe('onTransitionEnd', () => {
    it('should throw when no CSS property has been specified', () => {
      const { fixture } = setupTest({ skipTrackProperty: true });
      const errorHandler = TestBed.inject(ErrorHandler);
      const spy = spyOn(errorHandler, 'handleError');

      fixture.nativeElement.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'opacity' }),
      );

      expect(spy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          message: jasmine.stringMatching(
            /No CSS property specified for transition tracking/,
          ),
        }),
      );
    });

    it('should include the element tag name in the error', () => {
      const { fixture } = setupTest({ skipTrackProperty: true });
      const errorHandler = TestBed.inject(ErrorHandler);
      const spy = spyOn(errorHandler, 'handleError');

      fixture.nativeElement.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'opacity' }),
      );

      expect(spy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          message: jasmine.stringMatching(
            new RegExp(`'<${fixture.nativeElement.tagName.toLowerCase()}>'`),
          ),
        }),
      );
    });

    it('should emit transitionEnd when the tracked property transitions on the host element', () => {
      const { fixture } = setupTest({ trackProperty: 'opacity' });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyTransitionEndHandlerDirective,
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
        _SkyTransitionEndHandlerDirective,
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

      expect().nothing();
    });
  });

  describe('when animations are disabled', () => {
    it('should not emit transitionEnd on initial render', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyTransitionEndHandlerDirective,
      );
      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      fixture.detectChanges();

      expect(transitionEndEmitted).toBeFalse();
    });

    it('should emit transitionEnd in a microtask when the transitionTrigger changes', async () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let transitionEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyTransitionEndHandlerDirective,
      );
      handler.transitionEnd.subscribe(() => {
        transitionEndEmitted = true;
      });

      // Change the input to a new signal to trigger the effect.
      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      expect(transitionEndEmitted).toBeFalse();

      await fixture.whenStable();

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
      return fixture.nativeElement.querySelector('[skyTransitionEndHandler]');
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
        _SkyTransitionEndHandlerDirective,
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
