import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SKY_ANIMATIONS_DISABLED_CLASS_NAME } from './constants';
import { provideNoopSkyAnimations } from './provide-noop-animations';

@Component({
  template: '',
})
class TestComponent {}

describe('_skyAnimationsDisabled', () => {
  afterEach(() => {
    document.body.classList.remove(SKY_ANIMATIONS_DISABLED_CLASS_NAME);
  });

  it('should return false when the disabled class is not present', () => {
    // Dynamically import to test in injection context.
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(false);
  });

  it('should return true when the disabled class is present', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    // After TestBed initialization with the provider, the class should be on the body.
    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(true);
  });
});
