import { Component, input } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { SkyAnimationEmergeComponent } from './emerge';

@Component({
  imports: [SkyAnimationEmergeComponent],
  template: `
    <sky-animation-emerge
      [visible]="visible()"
      (transitionEnd)="onTransitionEnd()"
    >
      <p>Content</p>
    </sky-animation-emerge>
  `,
})
class TestComponent {
  public readonly visible = input(false);
  public transitionEndCount = 0;

  public onTransitionEnd(): void {
    this.transitionEndCount++;
  }
}

describe('SkyAnimationEmergeComponent', () => {
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
    return fixture.nativeElement.querySelector('sky-animation-emerge');
  }

  it('should render projected content', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    expect(el.textContent?.trim()).toBe('Content');
  });

  it('should add the visible class when visible is true', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    expect(el).not.toHaveClass('sky-animation-emerge-visible');

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    expect(el).toHaveClass('sky-animation-emerge-visible');
  });

  it('should remove the visible class when visible is false', () => {
    const fixture = createFixture();

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();

    const el = getHostElement(fixture);
    expect(el).not.toHaveClass('sky-animation-emerge-visible');
  });

  it('should emit transitionEnd on native transitionend events from the host element', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    el.dispatchEvent(
      new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'opacity',
      }),
    );

    expect(fixture.componentInstance.transitionEndCount).toBe(1);
  });

  it('should ignore transitionend events with a non-opacity propertyName', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);

    el.dispatchEvent(
      new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'transform',
      }),
    );

    expect(fixture.componentInstance.transitionEndCount).toBe(0);
  });

  it('should ignore transitionend events originating from child elements', () => {
    const fixture = createFixture();
    const child = fixture.nativeElement.querySelector('p');

    // Dispatch from a child. The event bubbles, but check that
    // stopPropagation prevents it from reaching ancestors of the host.
    const parentSpy = jasmine.createSpy('parentTransitionEnd');
    fixture.nativeElement.addEventListener('transitionend', parentSpy);

    child.dispatchEvent(
      new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'opacity',
      }),
    );

    // The host listener intercepts and stops propagation.
    expect(parentSpy).not.toHaveBeenCalled();
  });

  it('should stop propagation of transitionend events from the host element', () => {
    const fixture = createFixture();
    const el = getHostElement(fixture);
    const parentSpy = jasmine.createSpy('parentTransitionEnd');

    fixture.nativeElement.addEventListener('transitionend', parentSpy);
    el.dispatchEvent(
      new TransitionEvent('transitionend', {
        bubbles: true,
        propertyName: 'opacity',
      }),
    );

    expect(parentSpy).not.toHaveBeenCalled();
  });

  describe('with noop animations', () => {
    it('should emit transitionEnd when visibility changes', fakeAsync(() => {
      const fixture = createFixture({ noopAnimations: true });
      tick();

      // The effect fires once initially during creation.
      const initialCount = fixture.componentInstance.transitionEndCount;

      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      tick();

      expect(fixture.componentInstance.transitionEndCount).toBeGreaterThan(
        initialCount,
      );
    }));
  });
});
