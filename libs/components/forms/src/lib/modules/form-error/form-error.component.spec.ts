import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyFormErrorModule } from './form-error.module';
import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';
import { SkyFormErrorsModule } from './form-errors.module';

@Component({
  imports: [SkyFormErrorsModule, SkyFormErrorModule],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
  template: `
    <sky-form-error errorName="required" errorText="This field is required" />
  `,
})
class FormErrorWithTokenComponent {}

@Component({
  imports: [SkyFormErrorsModule, SkyFormErrorModule],
  template: `
    <sky-form-error errorName="required" errorText="This field is required" />
  `,
})
class FormErrorWithoutTokenComponent {}

describe('Form error component', () => {
  it('renders an error message when form errors enabled token is provided', () => {
    const fixture = TestBed.createComponent(FormErrorWithTokenComponent);

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sky-form-error'),
    ).toBeVisible();
  });

  it('throws an error when form errors enabled token is not provided', () => {
    expect(() =>
      TestBed.createComponent(FormErrorWithoutTokenComponent),
    ).toThrowError(
      'The `sky-form-error` component is not supported in the provided context.',
    );
  });
});
