import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SKY_ANIMATIONS_DISABLED_CLASS_NAME } from './constants';
import { provideNoopSkyAnimations } from './provide-noop-animations';

@Component({
  template: '',
})
class TestComponent {}

describe('provideNoopSkyAnimations', () => {
  afterEach(() => {
    document.body.classList.remove(SKY_ANIMATIONS_DISABLED_CLASS_NAME);
  });

  it('should add the disabled animations class to the body', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(true);
  });

  it('should remove the disabled animations class when the environment injector is destroyed', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(true);

    // Resetting the testing module destroys the environment injector,
    // which triggers the DestroyRef registered by the provider.
    TestBed.resetTestingModule();

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(false);
  });

  it('should register onDestroy cleanup for each consumer', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(true);

    // Resetting and re-configuring simulates serial test runs where
    // each test provides its own noop animations.
    TestBed.resetTestingModule();

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(false);

    // A second serial test also registers and cleans up correctly.
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(true);

    TestBed.resetTestingModule();

    expect(
      document.body.classList.contains(SKY_ANIMATIONS_DISABLED_CLASS_NAME),
    ).toBe(false);
  });
});
