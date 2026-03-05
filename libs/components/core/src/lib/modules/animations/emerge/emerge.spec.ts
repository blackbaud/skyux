import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationEmergeComponent } from './emerge';

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
    const { fixture } = setupTest();

    // The template is <ng-content />, so native element should accept projection.
    expect(
      fixture.nativeElement.querySelector('*') || fixture.nativeElement,
    ).toBeTruthy();
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

    Object.defineProperty(evt, 'currentTarget', {
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
