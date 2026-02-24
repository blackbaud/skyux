import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from './noop-sky-animations';

@Component({
  selector: 'sky-noop-animations-test',
  template: '<div class="test-el">Test</div>',
  styles: ['.test-el { transition: opacity 300ms ease; }'],
})
class NoopAnimationsTestComponent {}

describe('provideNoopSkyAnimations', () => {
  afterEach(() => {
    // Clean up the injected style element after each test.
    document.getElementById('sky-noop-animations')?.remove();
  });

  it('should inject a style element that disables CSS transitions and animations', () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsTestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(NoopAnimationsTestComponent);

    const styleEl = document.getElementById('sky-noop-animations');
    expect(styleEl).toBeTruthy();
    expect(styleEl?.textContent).toContain(
      '--sky-animation-duration-noop: 0.01ms',
    );
    expect(styleEl?.textContent).toContain(
      'transition-duration: var(--sky-animation-duration-noop) !important',
    );
    expect(styleEl?.textContent).toContain(
      'animation-duration: var(--sky-animation-duration-noop) !important',
    );
  });

  it('should not inject duplicate style elements when called multiple times', () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsTestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(NoopAnimationsTestComponent);

    // Reset and reconfigure TestBed to simulate a second test.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsTestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(NoopAnimationsTestComponent);

    const styleElements = document.querySelectorAll('#sky-noop-animations');
    expect(styleElements.length).toBe(1);
  });

  it('should disable computed transition on elements', () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsTestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(NoopAnimationsTestComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.test-el') as HTMLElement;
    const style = getComputedStyle(el);

    // 'transition-duration' should be near-zero because the global style overrides it.
    expect(parseFloat(style.transitionDuration)).toBeLessThan(0.001);
  });
});
