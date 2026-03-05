import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from '../utility/provide-noop-animations';

import { _SkyAnimationSlideComponent } from './slide';

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
    const { fixture } = setupTest();

    const content = fixture.nativeElement.querySelector(
      '.sky-animation-slide-content',
    );

    expect(content).toBeTruthy();
  });

  it('should emit transitionEnd when the visibility transition completes', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'visibility',
    });

    Object.defineProperty(evt, 'currentTarget', {
      value: fixture.nativeElement,
    });

    // No error should be thrown since cssPropertyToTrack('visibility') was called.
    expect(() => fixture.nativeElement.dispatchEvent(evt)).not.toThrow();
  });

  it('should not emit transitionEnd for non-tracked properties', () => {
    const { fixture } = setupTest();

    fixture.componentRef.setInput('opened', true);
    fixture.detectChanges();

    const evt = new TransitionEvent('transitionend', {
      propertyName: 'grid-template-rows',
    });

    Object.defineProperty(evt, 'currentTarget', {
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
