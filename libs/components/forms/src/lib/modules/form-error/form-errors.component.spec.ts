import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyFormErrorModule } from './form-error.module';
import { SKY_FORM_ERRORS_ENABLED } from './form-errors-enabled-token';
import { SkyFormErrorsModule } from './form-errors.module';

@Component({
  standalone: true,
  imports: [SkyFormErrorsModule, SkyFormErrorModule],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
  template: `
    <sky-form-errors [labelText]="labelText" [showErrors]="showErrors">
      <sky-form-error errorName="custom" errorMessage="Custom error" />
    </sky-form-errors>
  `,
})
class FormErrorsComponent {
  public labelText: string | undefined = 'Label text';
  public showErrors = true;
}

describe('Form errors component', () => {
  let fixture: ComponentFixture<FormErrorsComponent>;
  let componentInstance: FormErrorsComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormErrorsComponent);
    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should render custom errors when there are no known errors, labelText is present, and showErrors is true', () => {
    const formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );
    expect(formError).toExist();
    expect(formError).toBeVisible();
  });

  it('should not render any errors when they are passed but showErrors is false', () => {
    componentInstance.showErrors = false;

    fixture.detectChanges();
    const formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );
    expect(formError).toBeNull();
  });

  it('should not render any errors when they are passed but labelText is undefined', () => {
    componentInstance.labelText = undefined;

    fixture.detectChanges();
    fixture.detectChanges();
    const formError = fixture.nativeElement.querySelector(
      `sky-form-error[errorName='custom']`,
    );
    expect(formError).toBeNull();
  });
});
