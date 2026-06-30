import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidationErrors } from '@angular/forms';
import { expect } from '@skyux-sdk/testing';

import { SkyFormErrorModule } from './form-error.module';
import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';
import { SkyFormErrorsModule } from './form-errors.module';

@Component({
  imports: [SkyFormErrorsModule, SkyFormErrorModule],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
  template: `
    <sky-form-errors
      [labelText]="labelText()"
      [errors]="errors()"
      [touched]="touched()"
      [dirty]="dirty()"
    >
      <sky-form-error errorName="custom" errorMessage="Custom error" />
    </sky-form-errors>
  `,
})
class FormErrorsComponent {
  public errors = input<ValidationErrors | undefined>(undefined);
  public labelText = input<string | undefined>('Label text');
  public touched = input(false);
  public dirty = input<boolean | undefined>(false);
}

describe('Form errors component', () => {
  let fixture: ComponentFixture<FormErrorsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorsComponent);

    fixture.detectChanges();
  });
  it('should render known input errors when they are passed and a labelText is present based on touched and/or dirty', () => {
    fixture.componentRef.setInput('errors', {
      required: true,
      maxlength: true,
      minlength: true,
      skyDate: { invalid: true, minDate: '01/01/2024', maxDate: '01/01/2022' },
      skyFuzzyDate: {
        futureDisabled: true,
        invalid: true,
        maxDate: '01/2023',
        minDate: '01/2024',
        yearRequired: true,
      },
      skyEmail: true,
      skyPhoneField: true,
      skyTime: true,
      skyUrl: true,
    });
    fixture.detectChanges();

    // dirty
    fixture.componentRef.setInput('dirty', true);
    fixture.detectChanges();

    const formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='maxlength']`,
    );
    expect(formError).toExist();
    expect(formError).toBeVisible();

    // touched
    fixture.componentRef.setInput('dirty', undefined);
    fixture.componentRef.setInput('touched', true);
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

  it('should include the minimum or maximum date in the date error messages', () => {
    fixture.componentRef.setInput('errors', {
      skyDate: {
        invalid: true,
        maxDate: new Date('01/01/2025'),
        maxDateFormatted: '01/01/2025',
        minDate: new Date('01/01/2024'),
        minDateFormatted: '01/01/2024',
      },
      skyFuzzyDate: {
        futureDisabled: true,
        invalid: true,
        maxDate: new Date('01/01/2021'),
        maxDateFormatted: '01/01/2021',
        minDate: new Date('01/01/2020'),
        minDateFormatted: '01/01/2020',
        yearRequired: true,
      },
    });

    fixture.componentRef.setInput('dirty', true);
    fixture.componentRef.setInput('touched', true);
    fixture.detectChanges();

    const minDateErrorMessage = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='minDate'] .sky-status-indicator-message`,
    );
    const maxDateErrorMessage = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='maxDate'] .sky-status-indicator-message`,
    );
    const fuzzyMinDateErrorMessage = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='fuzzyMinDate'] .sky-status-indicator-message`,
    );
    const fuzzyMaxDateErrorMessage = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='fuzzyMaxDate'] .sky-status-indicator-message`,
    );

    expect(minDateErrorMessage.textContent).toEqual(
      'Select or enter a date on or after 01/01/2024.',
    );
    expect(maxDateErrorMessage.textContent).toEqual(
      'Select or enter a date on or before 01/01/2025.',
    );
    expect(fuzzyMinDateErrorMessage.textContent).toEqual(
      'Select or enter a date on or after 01/01/2020.',
    );
    expect(fuzzyMaxDateErrorMessage.textContent).toEqual(
      'Select or enter a date on or before 01/01/2021.',
    );
  });

  it('should render custom errors when there are no known errors and labelText is present regardless of touched or dirty', () => {
    fixture.componentRef.setInput('touched', true);
    fixture.detectChanges();

    let formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );

    expect(formError).toExist();
    expect(formError).toBeVisible();

    fixture.componentRef.setInput('touched', false);
    fixture.componentRef.setInput('dirty', true);
    fixture.detectChanges();

    formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );

    expect(formError).toExist();
    expect(formError).toBeVisible();
  });

  it('should not render any errors when they are passed but labelText is undefined', () => {
    fixture.componentRef.setInput('errors', {
      required: true,
      maxlength: true,
    });
    fixture.componentRef.setInput('labelText', undefined);

    fixture.detectChanges();

    ['required', 'custom', 'maxlength'].forEach((errorName) => {
      const formError = fixture.nativeElement.querySelector(
        `sky-form-error[errorName='${errorName}']`,
      );
      expect(formError).toBeNull();
    });
  });
});
