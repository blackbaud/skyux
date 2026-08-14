import { AbstractControl, FormControl } from '@angular/forms';

import { skyIsAbstractControl } from './is-abstract-control';

describe('skyIsAbstractControl', () => {
  it('returns true for a real AbstractControl', () => {
    expect(skyIsAbstractControl(new FormControl())).toBeTrue();
  });

  it('returns false for undefined', () => {
    expect(skyIsAbstractControl(undefined)).toBeFalse();
  });

  it('returns false for null', () => {
    expect(skyIsAbstractControl(null)).toBeFalse();
  });

  it('returns false for an object without a markAsTouched method', () => {
    expect(
      skyIsAbstractControl({
        value: 'foo',
      } as unknown as AbstractControl),
    ).toBeFalse();
  });
});
