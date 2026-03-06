import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { _skyAnimationsDisabled } from './animations-disabled';
import { SKY_ANIMATIONS_DISABLED_CLASS_NAME } from './constants';
import { provideNoopSkyAnimations } from './provide-noop-animations';

let animationsDisabled: boolean | undefined;

@Component({
  template: '',
})
class TestComponent {
  constructor() {
    animationsDisabled = _skyAnimationsDisabled();
  }
}

describe('_skyAnimationsDisabled', () => {
  afterEach(() => {
    document.body.classList.remove(SKY_ANIMATIONS_DISABLED_CLASS_NAME);
    animationsDisabled = undefined;
  });

  it('should return false when the disabled class is not present', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    TestBed.createComponent(TestComponent);

    expect(animationsDisabled).toBe(false);
  });

  it('should return true when the disabled class is present', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(animationsDisabled).toBe(true);
  });
});
