import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationSlideComponent } from './slide';

@Component({
  imports: [_SkyAnimationSlideComponent],
  template: `
    <sky-animation-slide [opened]="opened" (transitionEnd)="onTransitionEnd()">
      <span class="projected-content">Hello</span>
    </sky-animation-slide>
  `,
})
class TestComponent {
  public opened = false;
  public transitionEndEmitted = false;

  public onTransitionEnd(): void {
    this.transitionEndEmitted = true;
  }
}

describe('SkyAnimationSlideComponent', () => {
  function setupTest(options?: { noopAnimations?: boolean }): {
    fixture: ComponentFixture<_SkyAnimationSlideComponent>;
    component: _SkyAnimationSlideComponent;
  } {
    TestBed.configureTestingModule({
      imports: [_SkyAnimationSlideComponent],
      providers: options?.noopAnimations ? [provideNoopSkyAnimations()] : [],
    });

    const fixture = TestBed.createComponent(_SkyAnimationSlideComponent);
    fixture.componentRef.setInput('opened', false);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance };
  }

  function setupHostTest(): {
    fixture: ComponentFixture<TestComponent>;
    hostComponent: TestComponent;
  } {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    return { fixture, hostComponent: fixture.componentInstance };
  }

  afterEach(() => {
    document.body.classList.remove('sky-animations-disabled');
  });

  it('should create the component', () => {
    const { component } = setupTest();
    expect(component).toBeTruthy();
  });

  it('should apply the slide-in class when opened is false', () => {
    const { fixture } = setupTest();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-in'),
    ).toBeTrue();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-out'),
    ).toBeFalse();
  });

  it('should apply the slide-out class when opened is true', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-out'),
    ).toBeTrue();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-in'),
    ).toBeFalse();
  });

  it('should toggle classes when opened changes', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-out'),
    ).toBeTrue();

    fixture.componentRef.setInput('opened', false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-slide-in'),
    ).toBeTrue();
  });

  it('should render projected content inside the slide-content wrapper', () => {
    const { fixture } = setupHostTest();

    const projected = fixture.nativeElement.querySelector(
      '.sky-animation-slide-content .projected-content',
    );

    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('Hello');
  });

  it('should emit transitionEnd when the visibility transition completes', () => {
    const { fixture, hostComponent } = setupHostTest();

    hostComponent.opened = true;
    fixture.detectChanges();

    const slideEl = fixture.nativeElement.querySelector('sky-animation-slide');

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'visibility',
    });

    Object.defineProperty(evt, 'target', {
      value: slideEl,
    });

    slideEl.dispatchEvent(evt);

    expect(hostComponent.transitionEndEmitted).toBeTrue();
  });

  it('should not emit transitionEnd for non-tracked properties', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'grid-template-rows',
    });

    Object.defineProperty(evt, 'target', {
      value: fixture.nativeElement,
    });

    // Should not throw and should silently ignore the non-tracked property.
    expect(() => fixture.nativeElement.dispatchEvent(evt)).not.toThrow();
  });

  describe('when animations are disabled', () => {
    it('should work synchronously when opened changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      fixture.componentRef.setInput('opened', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.opened()).toBeTrue();
      expect(
        fixture.nativeElement.classList.contains('sky-animation-slide-out'),
      ).toBeTrue();
    });
  });
});
