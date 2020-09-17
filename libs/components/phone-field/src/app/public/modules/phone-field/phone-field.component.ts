import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyCountryFieldCountry
} from '@skyux/lookup';

import {
  PhoneNumberFormat,
  PhoneNumberType,
  PhoneNumberUtil
} from 'google-libphonenumber';

import 'intl-tel-input';

import {
  SkyPhoneFieldAdapterService
} from './phone-field-adapter.service';

import {
  SkyPhoneFieldCountry
} from './types/country';

import {
  SkyPhoneFieldNumberReturnFormat
} from './types/number-return-format';

// NOTE: The no-op animation is here in order to block the input's "fade in" animation
// from firing on initial load. For more information on this technique you can see
// https://www.bennadel.com/blog/3417-using-no-op-transitions-to-prevent-animation-during-the-initial-render-of-ngfor-in-angular-5-2-6.htm
@Component({
  selector: 'sky-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyPhoneFieldAdapterService
  ],
  animations: [
    trigger('blockAnimationOnLoad', [
      transition(':enter', [])
    ]),
    trigger(
      'countrySearchAnimation', [
        transition(':enter', [
          style({
            opacity: 0,
            width: 0
          }),
          animate('200ms ease-in', style({
            opacity: 1,
            width: '*'
          }))
        ]),
        transition(':leave', [
          animate('200ms ease-in', style({
            opacity: 0,
            width: 0
          }))
        ])
      ]
    ),
    trigger(
      'phoneInputAnimation', [
        transition(':enter', [
          style({
            opacity: 0
          }),
          animate('150ms ease-in', style({
            opacity: 1
          }))
        ]),
        transition(':leave', [
          animate('150ms ease-in', style({
            opacity: 0
          }))
        ])
      ]
    )
  ]
})
export class SkyPhoneFieldComponent implements OnDestroy, OnInit {

  /**
   * Specifies the
   * [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country. The country selector button displays a flag
   * icon for this default country until users select a different country.
   * @default us
   */
  @Input()
  public set defaultCountry(value: string) {
    if (value && value !== this._defaultCountry) {
      this._defaultCountry = value.toLowerCase();

      this.defaultCountryData = this.countries
        .find(country => country.iso2 === this._defaultCountry);
    }
  }

  public get defaultCountry(): string {
    return this._defaultCountry;
  }

  /**
   * Specifies the format for validated phone numbers.
   * @default 'default'
   */
  @Input()
  public returnFormat: SkyPhoneFieldNumberReturnFormat = 'default';

  /**
   * Emits a `SkyPhoneFieldCountry` object when the selected country in the country search
   * input changes.
   */

  @Output()
  public selectedCountryChange = new EventEmitter<SkyPhoneFieldCountry>();

  public countries: SkyPhoneFieldCountry[];

  public countrySelectDisabled = false;

  public countrySearchShown = false;

  public phoneInputShown = true;

  public countrySearchForm: FormGroup;

  @ViewChild('countrySearchInput', {
    read: ElementRef,
    static: false
  })
  public countrySearchInput: ElementRef;

  /**
   * Specifies the currently selected country to validate against.
   */
  @Input()
  public set selectedCountry(newCountry: SkyPhoneFieldCountry) {
    if (newCountry && (!this._selectedCountry || this._selectedCountry.iso2 !== newCountry.iso2)) {
      this._selectedCountry = newCountry ? this.countries.find(country => country.iso2 === newCountry.iso2) : undefined;

      if (!this._selectedCountry.exampleNumber) {
        const numberObj = this.phoneUtils.getExampleNumberForType(newCountry.iso2,
          PhoneNumberType.FIXED_LINE);
        this._selectedCountry.exampleNumber = this.phoneUtils.format(numberObj,
          PhoneNumberFormat.NATIONAL);
      }

      this.selectedCountryChange.emit(this._selectedCountry);
    }
  }

  public get selectedCountry(): SkyPhoneFieldCountry {
    return this._selectedCountry;
  }

  private defaultCountryData: SkyPhoneFieldCountry;

  private phoneInputAnimationTriggered = false;

  private phoneUtils = PhoneNumberUtil.getInstance();

  private longestDialCodeLength = 0;

  private _defaultCountry: string;

  private _selectedCountry: SkyPhoneFieldCountry;

  constructor(
    private formBuilder: FormBuilder,
    private adapterService: SkyPhoneFieldAdapterService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    /**
     * The json functions here ensures that we get a copy of the array and not the global original.
     * This ensures that multiple instances of the component don't overwrite the original data.
     *
     * We must type the window object as any here as the intl-tel-input library adds its object
     * to the main window object.
     */
    this.countries = JSON.parse(JSON.stringify((window as any)
      .intlTelInputGlobals.getCountryData()));
    for (let country of this.countries) {
      country.dialCode = '+' + country.dialCode;

      if (country.dialCode.length > this.longestDialCodeLength) {
        this.longestDialCodeLength = country.dialCode.length;
      }
    }

    this.countrySearchForm = this.formBuilder.group({
      countrySearch: new FormControl()
    });
  }

  public ngOnInit(): void {

    // The timeout here is needed to avoid a change before checked error when a user specifies
    // a selected country on intialization of the component.
    setTimeout(() => {
      if (!this.defaultCountry) {
        this.defaultCountry = 'us';
      }

      if (!this.selectedCountry) {
        this.selectedCountry = this.defaultCountryData;
      }
      this.changeDetector.markForCheck();
    }, 0);

    this.countrySearchForm.get('countrySearch').valueChanges.subscribe((newValue: SkyCountryFieldCountry) => {
      if (newValue && newValue.iso2 !== this.selectedCountry.iso2) {
        this.selectedCountry = newValue;
      }
    });
  }

  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param countryCode The International Organization for Standardization's two-letter code
   * for the default country.
   * @internal
   */
  public onCountrySelected(newCountry: SkyCountryFieldCountry): void {
    if (newCountry) {
      this.selectedCountry = this.countries.find(countryInfo => countryInfo.iso2 ===
        newCountry.iso2);
      this.toggleCountrySearch(false);
    }
  }

  public toggleCountrySearch(showSearch: boolean): void {
    this.phoneInputAnimationTriggered = true;

    if (showSearch) {
      this.phoneInputShown = false;
    } else {
      this.countrySearchShown = false;

      this.countrySearchForm.get('countrySearch').setValue(undefined);
    }

    this.changeDetector.markForCheck();
  }

  public countrySearchAnimationEnd() {
    if (!this.countrySearchShown) {
      this.phoneInputShown = true;
    } else {
      this.adapterService.focusCountrySearchElement(this.countrySearchInput);
    }

    this.changeDetector.markForCheck();
  }

  public phoneInputAnimationEnd() {
    if (!this.phoneInputShown) {
      this.countrySearchShown = true;
    } else {
      if (this.phoneInputAnimationTriggered) {
        this.adapterService.focusPhoneInput(this.elementRef);
        this.phoneInputAnimationTriggered = false;
      }
    }

    this.changeDetector.markForCheck();
  }

  public setCountryByDialCode(phoneNumber: string): boolean {
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      return false;
    }

    let newCountry: SkyPhoneFieldCountry;

    for (let i = 1; i < (this.longestDialCodeLength + 1); i++) {
      let dialCode = phoneNumber.substring(0, i);

      let foundCountry = this.countries
        .find(country => country.dialCode === dialCode && country.priority === 0);

      if (foundCountry && foundCountry !== this.selectedCountry) {
        newCountry = foundCountry;
      }
    }

    if (newCountry) {
      this.selectedCountry = newCountry;
      this.changeDetector.markForCheck();
      return true;
    }

    return false;
  }

}
