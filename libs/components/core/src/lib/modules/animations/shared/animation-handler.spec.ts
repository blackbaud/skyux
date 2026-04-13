import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { _SkyAnimationEndHandlerDirective } from './animation-handler';

@Component({
  hostDirectives: [
    {
      directive: _SkyAnimationEndHandlerDirective,
      inputs: ['animationTrigger: trigger', 'emitOnAnimateEnter'],
      outputs: ['animationEnd'],
    },
  ],
  selector: 'sky-test',
  template: '<span class="sky-test-child"></span>',
})
class TestComponent {}

@Component({
  imports: [_SkyAnimationEndHandlerDirective],
  selector: 'sky-test-template',
  template: `
    <div
      skyAnimationEndHandler
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

describe('SkyAnimationEndHandler', () => {
  function setupTest(): {
    fixture: ComponentFixture<TestComponent>;
    component: TestComponent;
  } {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('trigger', signal(false));
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance };
  }

  it('should create the directive', () => {
    const { fixture } = setupTest();

    const handler = fixture.debugElement.injector.get(
      _SkyAnimationEndHandlerDirective,
    );

    expect(handler).toBeTruthy();
  });

  describe('onAnimationEnd', () => {
    it('should emit animationEnd when animationend fires on the host element', () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
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
        _SkyAnimationEndHandlerDirective,
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

  describe('when CSS animations are disabled', () => {
    it('should not emit animationEnd on initial render', () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.detectChanges();

      expect(animationEndEmitted).toBeFalse();
    });

    it('should emit via microtask when animation-name is none', async () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.nativeElement.style.animationName = 'none';

      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      expect(animationEndEmitted).toBeFalse();

      await fixture.whenStable();

      expect(animationEndEmitted).toBeTrue();
    });

    it('should emit via microtask when animation-duration is 0s', async () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
      );
      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.nativeElement.style.animationName = 'some-anim';
      fixture.nativeElement.style.animationDuration = '0s';

      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      expect(animationEndEmitted).toBeFalse();

      await fixture.whenStable();

      expect(animationEndEmitted).toBeTrue();
    });

    it('should not emit via microtask when a CSS animation is active', async () => {
      const { fixture } = setupTest();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.nativeElement.style.animationName = 'sky-animation-emerge-enter';
      fixture.nativeElement.style.animationDuration = '250ms';

      fixture.componentRef.setInput('trigger', signal(true));
      fixture.detectChanges();

      await fixture.whenStable();

      expect(animationEndEmitted).toBeFalse();
    });

    it('should emit on initial render when emitOnAnimateEnter is true', async () => {
      TestBed.configureTestingModule({
        imports: [TestComponent],
      });

      const fixture = TestBed.createComponent(TestComponent);
      fixture.componentRef.setInput('trigger', signal(true));
      fixture.componentRef.setInput('emitOnAnimateEnter', true);
      fixture.detectChanges();

      let animationEndEmitted = false;

      const handler = fixture.debugElement.injector.get(
        _SkyAnimationEndHandlerDirective,
      );

      handler.animationEnd.subscribe(() => {
        animationEndEmitted = true;
      });

      fixture.detectChanges();

      await fixture.whenStable();

      expect(animationEndEmitted).toBeTrue();
    });
  });

  describe('animationTrigger input', () => {
    function setupTemplateTest(): ComponentFixture<TemplateTestComponent> {
      TestBed.configureTestingModule({
        imports: [TemplateTestComponent],
      });

      const fixture = TestBed.createComponent(TemplateTestComponent);
      fixture.detectChanges();

      return fixture;
    }

    function getDirectiveHost(
      fixture: ComponentFixture<TemplateTestComponent>,
    ): HTMLElement {
      return fixture.nativeElement.querySelector('[skyAnimationEndHandler]');
    }

    it('should emit animationEnd when animationend fires', () => {
      const fixture = setupTemplateTest();
      const host = getDirectiveHost(fixture);

      host.dispatchEvent(new AnimationEvent('animationend'));

      expect(fixture.componentInstance.animationEndEmitted).toBeTrue();
    });
  });
});
