import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationExpandComponent } from './expand';

@Component({
  imports: [_SkyAnimationExpandComponent],
  template: `
    <sky-animation-expand
      [minHeight]="minHeight"
      [opened]="opened"
      (transitionEnd)="onTransitionEnd()"
    >
      <span class="projected-content">Hello</span>
    </sky-animation-expand>
  `,
})
class TestComponent {
  public minHeight = '0';
  public opened = false;
  public transitionEndEmitted = false;

  public onTransitionEnd(): void {
    this.transitionEndEmitted = true;
  }
}

describe('SkyAnimationExpandComponent', () => {
  function setupTest(options?: { noopAnimations?: boolean }): {
    fixture: ComponentFixture<_SkyAnimationExpandComponent>;
    component: _SkyAnimationExpandComponent;
  } {
    TestBed.configureTestingModule({
      imports: [_SkyAnimationExpandComponent],
      providers: options?.noopAnimations ? [provideNoopSkyAnimations()] : [],
    });

    const fixture = TestBed.createComponent(_SkyAnimationExpandComponent);
    fixture.componentRef.setInput('opened', false);
    fixture.detectChanges();

    return { fixture, component: fixture.componentInstance };
  }

  function setupHostTest(options?: { minHeight?: string }): {
    fixture: ComponentFixture<TestComponent>;
    hostComponent: TestComponent;
  } {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);

    if (options?.minHeight) {
      fixture.componentInstance.minHeight = options.minHeight;
    }

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

  it('should apply the collapsed class when opened is false', () => {
    const { fixture } = setupTest();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-closed',
      ),
    ).toBeTrue();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-opened',
      ),
    ).toBeFalse();
  });

  it('should apply the expanded class when opened is true', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-opened',
      ),
    ).toBeTrue();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-closed',
      ),
    ).toBeFalse();
  });

  it('should toggle classes when opened changes', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-opened',
      ),
    ).toBeTrue();

    fixture.componentRef.setInput('opened', false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains(
        'sky-animation-expand-closed',
      ),
    ).toBeTrue();
  });

  it('should render projected content inside the content wrapper', () => {
    const { fixture } = setupHostTest();

    const projected = fixture.nativeElement.querySelector(
      '.sky-animation-expand-content .projected-content',
    );

    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('Hello');
  });

  it('should set the min-height CSS variable from the minHeight input', () => {
    const { fixture } = setupHostTest({ minHeight: '48px' });

    const gridEl: HTMLElement = fixture.nativeElement.querySelector(
      'sky-animation-expand',
    );

    expect(
      gridEl.style.getPropertyValue('--sky-animation-expand-min-height'),
    ).toBe('48px');
  });

  it('should default min-height CSS variable to 0', () => {
    const { fixture } = setupHostTest();

    const gridEl: HTMLElement = fixture.nativeElement.querySelector(
      'sky-animation-expand',
    );

    expect(
      gridEl.style.getPropertyValue('--sky-animation-expand-min-height'),
    ).toBe('0');
  });

  it('should emit transitionEnd when the grid-template-rows transition completes', () => {
    const { fixture, hostComponent } = setupHostTest();

    hostComponent.opened = true;
    fixture.detectChanges();

    const gridEl = fixture.nativeElement.querySelector(
      'sky-animation-expand',
    );

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'grid-template-rows',
    });

    Object.defineProperty(evt, 'target', {
      value: gridEl,
    });

    gridEl.dispatchEvent(evt);

    expect(hostComponent.transitionEndEmitted).toBeTrue();
  });

  it('should not emit transitionEnd for non-tracked properties', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'opacity',
    });

    Object.defineProperty(evt, 'target', {
      value: fixture.nativeElement,
    });

    expect(() => fixture.nativeElement.dispatchEvent(evt)).not.toThrow();
  });

  describe('when animations are disabled', () => {
    it('should work synchronously when opened changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      fixture.componentRef.setInput('opened', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.opened()).toBeTrue();
      expect(
        fixture.nativeElement.classList.contains(
          'sky-animation-expand-opened',
        ),
      ).toBeTrue();
    });
  });
});
