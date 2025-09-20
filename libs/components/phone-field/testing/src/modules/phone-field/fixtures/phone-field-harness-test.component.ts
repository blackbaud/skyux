import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyPhoneFieldCountry,
  SkyPhoneFieldModule,
  SkyPhoneFieldNumberReturnFormat,
} from '@skyux/phone-field';

@Component({
  selector: 'sky-phone-field-test',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyPhoneFieldModule,
    SkyStatusIndicatorModule,
  ],
  template: `
    <form class="phone-field-demo" [formGroup]="phoneForm">
      <sky-phone-field
        data-sky-id="test-phone-field"
        [allowExtensions]="allowExtensions"
        [defaultCountry]="defaultCountry"
        [returnFormat]="returnFormat"
        [supportedCountryISOs]="supportedCountryISOs"
        [(selectedCountry)]="selectedCountry"
        (selectedCountryChange)="selectedCountryChange($event)"
      >
        <input
          formControlName="phoneControl"
          skyPhoneFieldInput
          [attr.disabled]="disabled"
          [skyPhoneFieldNoValidate]="noValidate"
        />
      </sky-phone-field>

      @if (!phoneControl?.valid) {
        <sky-status-indicator descriptionType="none" indicatorType="danger">
          Enter a phone number matching the format for the selected country.
        </sky-status-indicator>
      }
    </form>
  `,
})
export class PhoneFieldHarnessTestComponent {
  public allowExtensions = true;
  public defaultCountry: string | undefined;
  public disabled: boolean | undefined;
  public noValidate = false;
  public returnFormat: SkyPhoneFieldNumberReturnFormat | undefined;
  public selectedCountry: SkyPhoneFieldCountry | undefined;
  public showInvalidDirective = false;
  public supportedCountryISOs: string[] | undefined;

  public phoneControl: UntypedFormControl | undefined;
  public phoneForm: FormGroup;

  public selectedCountryChange = jasmine.createSpy();

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = this.#formBuilder.group({
      phoneControl: this.phoneControl,
    });
  }
}
