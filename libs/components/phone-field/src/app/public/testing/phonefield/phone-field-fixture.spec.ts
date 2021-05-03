import {
  Component,
  OnInit
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  SkyStatusIndicatorModule
} from '@skyux/indicators';

import {
  SkyPhoneFieldCountry,
  SkyPhoneFieldNumberReturnFormat
} from '@skyux/phone-field';

import {
  SkyPhoneFieldFixture
} from './phone-field-fixture';

import {
  SkyPhoneFieldTestingModule
} from './phone-field-testing.module';

const COUNTRY_AU: SkyPhoneFieldCountry = {
  name: 'Australia',
  iso2: 'au',
  dialCode: '+61'
};
const COUNTRY_US: SkyPhoneFieldCountry = {
  name: 'United States',
  iso2: 'us',
  dialCode: '+1'
};
const DATA_SKY_ID = 'test-phone-field';
const VALID_AU_NUMBER = '0212345678';
const VALID_US_NUMBER = '8675555309';

//#region Test component
@Component({
  selector: 'phone-field-test',
  template: `
  <form
    class='phone-field-demo'
    [formGroup]="phoneForm"
  >
    <sky-phone-field
      data-sky-id="${DATA_SKY_ID}"
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
      >
    </sky-phone-field>

    <sky-status-indicator *ngIf="!phoneControl.valid"
      descriptionType="none"
      indicatorType="danger"
    >
      Enter a phone number matching the format for the selected country.
    </sky-status-indicator>
  </form>
`
})
class PhoneFieldTestComponent implements OnInit {
  public allowExtensions: boolean = true;
  public defaultCountry: string;
  public disabled: boolean;
  public noValidate: boolean = false;
  public returnFormat: SkyPhoneFieldNumberReturnFormat;
  public selectedCountry: SkyPhoneFieldCountry;
  public showInvalidDirective: boolean = false;
  public supportedCountryISOs: string[];

  public phoneControl: FormControl;
  public phoneForm: FormGroup;

  public selectedCountryChange(query: string): void { }

  public ngOnInit(): void {
    this.phoneControl = new FormControl();
    this.phoneForm = new FormGroup({
      'phoneControl': this.phoneControl
    });
  }
}
//#endregion Test component

describe('PhoneField fixture', () => {
  let fixture: ComponentFixture<PhoneFieldTestComponent>;
  let testComponent: PhoneFieldTestComponent;
  let phonefieldFixture: SkyPhoneFieldFixture;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFieldTestComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyPhoneFieldTestingModule,
        SkyStatusIndicatorModule
      ]
    });

    // create the fixture, waiting until it's stable since it selects a country on init
    fixture = TestBed.createComponent(
      PhoneFieldTestComponent
    );
    testComponent = fixture.componentInstance;
    phonefieldFixture = new SkyPhoneFieldFixture(fixture, DATA_SKY_ID);
  });

  it('should be able to check if phone field is disabled', async () => {
    let isDisabled = await phonefieldFixture.isDisabled();
    expect(isDisabled).toBe(false);

    testComponent.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();
    isDisabled = await phonefieldFixture.isDisabled();
    expect(isDisabled).toBe(true);
  });

  it('should be able to check if phone field is invalid', async () => {
    expect(await phonefieldFixture.isValid()).toBe(true);
    testComponent.phoneControl.setValidators(Validators.required);

    await phonefieldFixture.setInputText('');
    await phonefieldFixture.blur();

    expect(await phonefieldFixture.isValid()).toBe(false);
  });

  it('should use selected country', async () => {
    // enter a valid phone number for the default country
    await phonefieldFixture.setInputText(VALID_US_NUMBER);

    // expect the model to use the proper dial code and format
    expect(phonefieldFixture.inputText).toBe(VALID_US_NUMBER);
    expect(testComponent.phoneControl.value).toEqual('(867) 555-5309');
  });

  it('should use newly selected country', async () => {
    const selectedCountryChangeSpy = spyOn(fixture.componentInstance, 'selectedCountryChange');

    // change the country
    await phonefieldFixture.selectCountry(COUNTRY_AU.name);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(testComponent.selectedCountry.name).toBe(COUNTRY_AU.name);
    expect(selectedCountryChangeSpy).toHaveBeenCalledWith(jasmine.objectContaining(COUNTRY_AU));

    // enter a valid phone number for the new country
    await phonefieldFixture.setInputText(VALID_AU_NUMBER);

    // expect the model to use the proper dial code and format
    expect(phonefieldFixture.inputText).toBe(VALID_AU_NUMBER);
    expect(testComponent.phoneControl.value).toEqual('+61 2 1234 5678');
  });

  it('should return expected country search results', async () => {

    // wait for initial country selection to finish before setting up the spy
    fixture.detectChanges();
    await fixture.whenStable();
    const selectedCountryChangeSpy = spyOn(fixture.componentInstance, 'selectedCountryChange');

    // search for a country by name
    const results = await phonefieldFixture.searchCountry(COUNTRY_AU.name);

    fixture.detectChanges();
    await fixture.whenStable();

    // ensure no country selection has taken place yet
    expect(selectedCountryChangeSpy).toHaveBeenCalledTimes(0);

    // verify the country search results match the country
    expect(results.length).toBe(1);
    expect(results[0]).toBe(COUNTRY_AU.name);
  });

  it('should not have constructor race condition', async () => {
    // There is some concern that the delayed instantiation of the country field in the fixture's
    // constructor will cause a race condition. We attempt to access the country field as early as
    // possible here to try and trigger any race condition.
    await phonefieldFixture.selectCountry(COUNTRY_US.name);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(testComponent.selectedCountry.name).toBe(COUNTRY_US.name);
  });
});
