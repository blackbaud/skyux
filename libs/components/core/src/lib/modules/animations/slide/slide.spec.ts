import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { SkyAnimationSlideComponent } from './slide';
import { SkyAnimationSlideDirection } from './slide-direction';

@Component({
  imports: [SkyAnimationSlideComponent],
  template: `
    <sky-animation-slide
      [slideDirection]="slideDirection()"
      (transitionEnd)="onTransitionEnd()"
    >
      <p>Slide content</p>
    </sky-animation-slide>
  `,
})
class TestComponent {
  public readonly slideDirection = input<SkyAnimationSlideDirection>('in');
  public transitionEndCount = 0;

  public onTransitionEnd(): void {
    this.transitionEndCount++;
  }
}

describe('SkyAnimationSlideComponent', () => {
  function createFixture(options?: {
    noopAnimations?: boolean;
  }): ComponentFixture<TestComponent> {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: options?.noopAnimations ? [provideNoopSkyAnimations()] : [],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture;
  }

  function getHostElement(
    fixture: ComponentFixture<TestComponent>,
  ): HTMLElement {
    return fixture.nativeElement.querySelector('sky-animation-slide');
  }

  it('should render projected content', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    expect(el.textContent?.trim()).toBe('Slide content');
  });

  it('should apply the slide-in class when slideDirection is "in"', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    expect(el).toHaveClass('sky-animation-slide-in');
    expect(el).not.toHaveClass('sky-animation-slide-out');
  });

  it('should apply the slide-out class when slideDirection is "out"', () => {
    const fixture = createFixture();

    fixture.componentRef.setInput('slideDirection', 'out');
    fixture.detectChanges();

    const el = getHostElement(fixture);
    expect(el).toHaveClass('sky-animation-slide-out');
    expect(el).not.toHaveClass('sky-animation-slide-in');
  });

  it('should switch classes when slideDirection changes', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    expect(el).toHaveClass('sky-animation-slide-in');

    fixture.componentRef.setInput('slideDirection', 'out');
    fixture.detectChanges();

    expect(el).toHaveClass('sky-animation-slide-out');
    expect(el).not.toHaveClass('sky-animation-slide-in');

    fixture.componentRef.setInput('slideDirection', 'in');
    fixture.detectChanges();

    expect(el).toHaveClass('sky-animation-slide-in');
    expect(el).not.toHaveClass('sky-animation-slide-out');
  });

  it('should emit transitionEnd on native transitionend events from the host element', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    el.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true }));

    expect(fixture.componentInstance.transitionEndCount).toBe(1);
  });

  it('should stop propagation of transitionend events originating from child elements', () => {
    const fixture = createFixture();
    const parentSpy = jasmine.createSpy('parentTransitionEnd');
    const child = fixture.nativeElement.querySelector('p');

    fixture.nativeElement.addEventListener('transitionend', parentSpy);

    child.dispatchEvent(
      new TransitionEvent('transitionend', { bubbles: true }),
    );

    // The host listener intercepts and stops propagation.
    expect(parentSpy).not.toHaveBeenCalled();
  });

  it('should stop propagation of transitionend events from the host element', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);
    const parentSpy = jasmine.createSpy('parentTransitionEnd');

    fixture.nativeElement.addEventListener('transitionend', parentSpy);
    el.dispatchEvent(new TransitionEvent('transitionend', { bubbles: true }));

    expect(parentSpy).not.toHaveBeenCalled();
  });

  it('should render the slide content wrapper', () => {
    const fixture = createFixture();
    const wrapper = fixture.nativeElement.querySelector(
      '.sky-animation-slide-content',
    );

    expect(wrapper).toBeTruthy();
    expect(wrapper.textContent?.trim()).toBe('Slide content');
  });

  describe('with noop animations', () => {
    it('should emit transitionEnd when slideDirection changes', () => {
      const fixture = createFixture({ noopAnimations: true });

      // The effect fires once initially during creation.
      const initialCount = fixture.componentInstance.transitionEndCount;

      fixture.componentRef.setInput('slideDirection', 'out');
      fixture.detectChanges();

      expect(fixture.componentInstance.transitionEndCount).toBeGreaterThan(
        initialCount,
      );
    });
  });
});
