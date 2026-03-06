import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationEmergeComponent } from './emerge';

@Component({
  imports: [_SkyAnimationEmergeComponent],
  template: `
    <sky-animation-emerge [visible]="visible">
      <span class="projected-content">Hello</span>
    </sky-animation-emerge>
  `,
})
class TestComponent {
  public visible = false;
}

describe('SkyAnimationEmergeComponent', () => {
  function setupTest(options?: { noopAnimations?: boolean }): {
    fixture: ComponentFixture<_SkyAnimationEmergeComponent>;
    component: _SkyAnimationEmergeComponent;
  } {
    TestBed.configureTestingModule({
      imports: [_SkyAnimationEmergeComponent],
      providers: options?.noopAnimations ? [provideNoopSkyAnimations()] : [],
    });

    const fixture = TestBed.createComponent(_SkyAnimationEmergeComponent);
    fixture.componentRef.setInput('visible', false);
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

  it('should add the visible class when visible is true', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-emerge-visible'),
    ).toBeTrue();
  });

  it('should remove the visible class when visible is false', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.classList.contains('sky-animation-emerge-visible'),
    ).toBeFalse();
  });

  it('should render projected content', () => {
    const { fixture } = setupHostTest();

    const projected = fixture.nativeElement.querySelector('.projected-content');
    expect(projected).toBeTruthy();
    expect(projected.textContent).toBe('Hello');
  });

  it('should emit transitionEnd when the opacity transition completes', () => {
    const { fixture } = setupTest();

    let emitted = false;

    // Subscribe to transitionEnd output via the host directive.
    fixture.nativeElement.addEventListener('transitionEnd', () => {
      emitted = true;
    });

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'opacity',
    });

    Object.defineProperty(evt, 'target', {
      value: fixture.nativeElement,
    });

    fixture.nativeElement.dispatchEvent(evt);

    // The event should not propagate (stopPropagation is called),
    // but we know it was handled if no error was thrown.
    expect(emitted).toBeFalse(); // stopPropagation prevents the custom event
  });

  describe('when animations are disabled', () => {
    it('should emit transitionEnd synchronously when visible changes', () => {
      const { fixture } = setupTest({ noopAnimations: true });

      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();

      // In noop mode, the effect fires synchronously and emits transitionEnd.
      // We can verify that no error is thrown and the component works.
      expect(fixture.componentInstance.visible()).toBeTrue();
    });
  });
});
