import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideNoopSkyAnimations } from './provide-noop-sky-animations';

@Component({
  template: '',
})
class TestComponent {}

describe('provideNoopSkyAnimations', () => {
  afterEach(() => {
    document.body.classList.remove('sky-theme-animations-disabled');
  });

  it('should add the `sky-theme-animations-disabled` class to the document body', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    // Creating a component triggers the environment initializer.
    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains('sky-theme-animations-disabled'),
    ).toBeTrue();
  });

  it('should not duplicate the class when provided multiple times', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    TestBed.createComponent(TestComponent);

    expect(
      document.body.classList.contains('sky-theme-animations-disabled'),
    ).toBeTrue();

    // classList.add is idempotent — adding the same class again
    // should not create a duplicate entry.
    document.body.classList.add('sky-theme-animations-disabled');

    const count = Array.from(document.body.classList).filter(
      (c) => c === 'sky-theme-animations-disabled',
    ).length;

    expect(count).toBe(1);
  });
});
