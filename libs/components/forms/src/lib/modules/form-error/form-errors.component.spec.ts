import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import { expect } from '@skyux-sdk/testing';

import { SkyFormErrorModule } from './form-error.module';
import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';
import { SkyFormErrorsModule } from './form-errors.module';

@Component({
  standalone: true,
  imports: [SkyFormErrorsModule, SkyFormErrorModule],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
  template: `
    <sky-form-errors
      [labelText]="labelText"
      [errors]="errors"
      [touched]="touched"
      [dirty]="dirty"
    >
      <sky-form-error errorName="custom" errorMessage="Custom error" />
    </sky-form-errors>
  `,
})
class FormErrorsComponent {
  public errors?: ValidationErrors | undefined;
  public labelText: string | undefined = 'Label text';
  public touched = false;
  public dirty: boolean | undefined = false;
}

describe('Form errors component', () => {
  let fixture: ComponentFixture<FormErrorsComponent>;
  let componentInstance: FormErrorsComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorsComponent);
    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
  });
  it('should render known input errors when they are passed and a labelText is present based on touched and/or dirty', () => {
    componentInstance.errors = {
      required: true,
      maxlength: true,
      minlength: true,
      skyDate: { invalid: true, minDate: true, maxDate: true },
      skyFuzzyDate: {
        futureDisabled: true,
        invalid: true,
        maxDate: true,
        minDate: true,
        yearRequired: true,
      },
      skyEmail: true,
      skyPhoneField: true,
      skyTime: true,
      skyUrl: true,
    };
    fixture.detectChanges();

    // dirty
    componentInstance.dirty = true;
    fixture.detectChanges();

    const formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='maxlength']`,
    );
    expect(formError).toExist();
    expect(formError).toBeVisible();

    // touched
    componentInstance.dirty = undefined;
    componentInstance.touched = true;
    fixture.detectChanges();

    [
      'required',
      'minlength',
      'maxlength',
      'invalidDate',
      'minDate',
      'maxDate',
      'fuzzyFutureDisabled',
      'fuzzyInvalidDate',
      'fuzzyMaxDate',
      'fuzzyMinDate',
      'fuzzyYearRequired',
      'email',
      'phone',
      'time',
      'url',
      'custom',
    ].forEach((errorName) => {
      const formError = fixture.nativeElement.querySelector(
        `sky-form-error[errorName='${errorName}']`,
      );
      expect(formError).toExist();
      expect(formError).toBeVisible();
    });
  });

  it('should render custom errors when there are no known errors and labelText is present regardless of touched or dirty', () => {
    componentInstance.touched = true;
    fixture.detectChanges();

    let formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );

    expect(formError).toExist();
    expect(formError).toBeVisible();

    componentInstance.touched = false;
    componentInstance.dirty = true;
    fixture.detectChanges();

    formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );

    expect(formError).toExist();
    expect(formError).toBeVisible();
  });

  it('should not render any errors when they are passed but labelText is undefined', () => {
    componentInstance.errors = {
      required: true,
      maxlength: true,
    };
    componentInstance.labelText = undefined;

    fixture.detectChanges();

    ['required', 'custom', 'maxlength'].forEach((errorName) => {
      const formError = fixture.nativeElement.querySelector(
        `sky-form-error[errorName='${errorName}']`,
      );
      expect(formError).toBeNull();
    });
  });
});
