import { Component, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyPhoneFieldCountry,
  SkyPhoneFieldNumberReturnFormat,
} from '@skyux/phone-field';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyPhoneFieldFixture } from './phone-field-fixture';
import { SkyPhoneFieldTestingModule } from './phone-field-testing.module';

const COUNTRY_AU: SkyPhoneFieldCountry = {
  name: 'Australia',
  iso2: 'au',
  dialCode: '+61',
};
const COUNTRY_US: SkyPhoneFieldCountry = {
  name: 'United States',
  iso2: 'us',
  dialCode: '+1',
};
const DATA_SKY_ID = 'test-phone-field';
const VALID_AU_NUMBER = '0212345678';
const VALID_US_NUMBER = '8675555309';

//#region Test component
@Component({
  selector: 'sky-phone-field-test',
  template: `
    <form class="phone-field-demo" [formGroup]="phoneForm">
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
        />
      </sky-phone-field>

      @if (!phoneControl.valid) {
        <sky-status-indicator descriptionType="none" indicatorType="danger">
          Enter a phone number matching the format for the selected country.
        </sky-status-indicator>
      }
    </form>
  `,
  standalone: false,
})
class PhoneFieldTestComponent implements OnInit {
  public allowExtensions = true;
  public defaultCountry: string | undefined;
  public disabled: boolean | undefined;
  public noValidate = false;
  public returnFormat: SkyPhoneFieldNumberReturnFormat | undefined;
  public selectedCountry: SkyPhoneFieldCountry | undefined;
  public showInvalidDirective = false;
  public supportedCountryISOs: string[] | undefined;

  public phoneControl: UntypedFormControl | undefined;
  public phoneForm: UntypedFormGroup | undefined;

  public selectedCountryChange = jasmine.createSpy();

  public ngOnInit(): void {
    this.phoneControl = new UntypedFormControl();
    this.phoneForm = new UntypedFormGroup({
      phoneControl: this.phoneControl,
    });
  }
}
//#endregion Test component

describe('PhoneField fixture', () => {
  let fixture: ComponentFixture<PhoneFieldTestComponent>;
  let testComponent: PhoneFieldTestComponent;
  let phonefieldFixture: SkyPhoneFieldFixture;
  let mockThemeSvc: any;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [PhoneFieldTestComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SkyPhoneFieldTestingModule,
        SkyStatusIndicatorModule,
      ],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    // create the fixture, waiting until it's stable since it selects a country on init
    fixture = TestBed.createComponent(PhoneFieldTestComponent);
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
    testComponent.phoneControl?.setValidators(Validators.required);

    await phonefieldFixture.setInputText('');
    await phonefieldFixture.blur();

    expect(await phonefieldFixture.isValid()).toBe(false);
  });

  it('should use selected country', async () => {
    // enter a valid phone number for the default country
    await phonefieldFixture.setInputText(VALID_US_NUMBER);

    // expect the model to use the proper dial code and format
    expect(phonefieldFixture.inputText).toBe(VALID_US_NUMBER);
    expect(testComponent.phoneControl?.value).toEqual('(867) 555-5309');
  });

  it('should use newly selected country', async () => {
    fixture.componentInstance.selectedCountryChange.calls.reset();

    if (COUNTRY_AU.name) {
      // change the country
      await phonefieldFixture.selectCountry(COUNTRY_AU.name);
    }

    const countryName: string | null =
      await phonefieldFixture.getSelectedCountryName();

    const countryIos2: string | null =
      await phonefieldFixture.getSelectedCountryIso2();

    fixture.detectChanges();
    await fixture.whenStable();

    if (COUNTRY_AU?.name && countryName) {
      expect(countryName).toBe(COUNTRY_AU.name);
    }
    if (COUNTRY_AU?.iso2 && countryIos2) {
      expect(countryIos2).toBe(COUNTRY_AU.iso2);
    }
    expect(
      fixture.componentInstance.selectedCountryChange,
    ).toHaveBeenCalledWith(jasmine.objectContaining(COUNTRY_AU));

    // enter a valid phone number for the new country
    await phonefieldFixture.setInputText(VALID_AU_NUMBER);

    // expect the model to use the proper dial code and format
    expect(phonefieldFixture.inputText).toBe(VALID_AU_NUMBER);
    expect(testComponent.phoneControl?.value).toEqual('+61 2 1234 5678');
  });

  it('should return expected country search results', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.selectedCountryChange.calls.reset();

    if (COUNTRY_AU.name) {
      // search for a country by name
      const results = await phonefieldFixture.searchCountry(COUNTRY_AU.name);

      fixture.detectChanges();
      await fixture.whenStable();

      // ensure no country selection has taken place yet
      expect(
        fixture.componentInstance.selectedCountryChange,
      ).toHaveBeenCalledTimes(0);

      // verify the country search results match the country
      expect(results.length).toBe(1);
      expect(results[0]).toEqual(COUNTRY_AU.name);
    }
  });

  it('should not have constructor race condition', async () => {
    // There is some concern that the delayed instantiation of the country field in the fixture's
    // constructor will cause a race condition. We attempt to access the country field as early as
    // possible here to try and trigger any race condition.

    if (COUNTRY_US.name) {
      await phonefieldFixture.selectCountry(COUNTRY_US.name);
    }

    fixture.detectChanges();
    await fixture.whenStable();

    expect(testComponent.selectedCountry?.name).toBe(COUNTRY_US.name);
  });
});
