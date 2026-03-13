import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationAnimationHandlerDirective } from './animation-handler';

@Component({
  hostDirectives: [
    {
      directive: _SkyAnimationAnimationHandlerDirective,
      inputs: ['animationTrigger: trigger'],
      outputs: ['animationEnd'],
    },
  ],
  selector: 'sky-test',
  template: '<span class="sky-test-child"></span>',
})
class TestComponent {}

@Component({
  imports: [_SkyAnimationAnimationHandlerDirective],
  selector: 'sky-test-template',
  template: `
    <div
      skyAnimationAnimationHandler
      [animationTrigger]="trigger()"
      (animationEnd)="onAnimationEnd()"
    ></div>
  `,
})
class TemplateTestComponent {
  public readonly trigger = input<unknown>(false);
  public animationEndEmitted = false;

  protected onAnimationEnd(): void {
    this.animationEndEmitted = true;
  }
}

describe('SkyAnimationAnimationHandler', () => {
  function setupTest(options?: { noopAnimations?: boolean }): {
    fixture: ComponentFixture<TestComponent>;
    component: TestComponent;
  } {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        ...(options?.noopAnimations ? [provideNoopSkyAnimations()] : []),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
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
      _SkyAnimationAnimationHandlerDirective,
    );

    expect(handler).toBeTruthy();
  });

  describe('onAnimationEnd', () => {
    it('should emit animationEnd when animationend fires on the host element', () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationAnimationHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.nativeElement.dispatchEvent(new AnimationEvent('animationend'));

      expect(animationEndEmitted).toBeTrue();
    });

    it('should emit animationEnd for animationend events that bubble from child elements', () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationAnimationHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      const child = fixture.nativeElement.querySelector('.sky-test-child');

      child.dispatchEvent(
        new AnimationEvent('animationend', { bubbles: true }),
      );

      expect(animationEndEmitted).toBeTrue();
    });
  });

  describe('when animations are disabled', () => {
    it('should not emit animationEnd on initial render', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationAnimationHandlerDirective,
      );
      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.detectChanges();

      expect(animationEndEmitted).toBeFalse();
    });

    it('should emit animationEnd synchronously when the animationTrigger changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationAnimationHandlerDirective,
      );
      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      expect(animationEndEmitted).toBeTrue();
    });
  });

  describe('animationTrigger input', () => {
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
      fixture.detectChanges();

      return fixture;
    }

    function getDirectiveHost(
      fixture: ComponentFixture<TemplateTestComponent>,
    ): HTMLElement {
      return fixture.nativeElement.querySelector(
        '[skyAnimationAnimationHandler]',
      );
    }

    it('should emit animationEnd when animationend fires', () => {
      const fixture = setupTemplateTest();
      const host = getDirectiveHost(fixture);

      host.dispatchEvent(new AnimationEvent('animationend'));

      expect(fixture.componentInstance.animationEndEmitted).toBeTrue();
    });
  });
});
