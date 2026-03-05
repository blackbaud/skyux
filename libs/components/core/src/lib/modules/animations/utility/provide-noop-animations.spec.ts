import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SKY_DISABLED_ANIMATIONS_CLASS_NAME } from './constants';
import { provideNoopSkyAnimations } from './provide-noop-animations';

@Component({
  template: '',
})
class TestComponent {}

describe('provideNoopSkyAnimations', () => {
  afterEach(() => {
    document.body.classList.remove(SKY_DISABLED_ANIMATIONS_CLASS_NAME);
  });

  it('should add the disabled animations class to the body', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME),
    ).toBe(true);
  });

  it('should remove the disabled animations class when the environment injector is destroyed', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME),
    ).toBe(true);

    // Resetting the testing module destroys the environment injector,
    // which triggers the DestroyRef registered by the provider.
    TestBed.resetTestingModule();

    expect(
      document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME),
    ).toBe(false);
  });

  it('should not add the class twice if already present', () => {
    document.body.classList.add(SKY_DISABLED_ANIMATIONS_CLASS_NAME);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME),
    ).toBe(true);

    // When the class was already present before the provider ran,
    // destroying should not remove it (the provider skipped adding).
    TestBed.resetTestingModule();

    expect(
      document.body.classList.contains(SKY_DISABLED_ANIMATIONS_CLASS_NAME),
    ).toBe(true);
  });
});
