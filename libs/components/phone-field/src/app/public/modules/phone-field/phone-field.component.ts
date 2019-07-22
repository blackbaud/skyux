import {
  animate,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyAutocompleteInputDirective,
  SkyAutocompleteSelectionChange
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
} from './types';

/**
 * NOTE: The no-op animation is here in order to block the input's "fade in" animation
 * from firing on initial load. For more information on this technique you can see
 * https://www.bennadel.com/blog/3417-using-no-op-transitions-to-prevent-animation-during-the-initial-render-of-ngfor-in-angular-5-2-6.htm
 */
@Component({
  selector: 'sky-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
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

  @Input()
  public set defaultCountry(value: string) {
    if (value !== this._defaultCountry) {
      this._defaultCountry = value.toLowerCase();

      this.defaultCountryData = this.countries
        .find(country => country.iso2 === this._defaultCountry);
      this.sortCountriesWithSelectedAndDefault(this.selectedCountry);
    }
  }

  public get defaultCountry(): string {
    return this._defaultCountry;
  }

  @Output()
  public selectedCountryChange = new EventEmitter<SkyPhoneFieldCountry>();

  public countries: SkyPhoneFieldCountry[];

  public countrySelectDisabled = false;

  public countrySearchShown = false;

  public phoneInputShown = true;

  public countrySearchForm: FormGroup;

  @ViewChild('countrySearchInput')
  public countrySearchInput: ElementRef;

  @ViewChild(SkyAutocompleteInputDirective)
  public countrySearchAutocompleteDirective: SkyAutocompleteInputDirective;

  public set selectedCountry(newCountry: SkyPhoneFieldCountry) {
    if (newCountry && this._selectedCountry !== newCountry) {
      this._selectedCountry = newCountry;

      if (!this._selectedCountry.exampleNumber) {
        const numberObj = this.phoneUtils.getExampleNumberForType(newCountry.iso2,
          PhoneNumberType.FIXED_LINE);
        this._selectedCountry.exampleNumber = this.phoneUtils.format(numberObj,
          PhoneNumberFormat.NATIONAL);
      }

      this.sortCountriesWithSelectedAndDefault(newCountry);

      this.selectedCountryChange.emit(newCountry);
    }
  }

  public get selectedCountry(): SkyPhoneFieldCountry {
    return this._selectedCountry;
  }

  private defaultCountryData: SkyPhoneFieldCountry;

  private phoneUtils = PhoneNumberUtil.getInstance();

  private intialLoad = true;

  private longestDialCodeLength = 0;

  private _defaultCountry: string;

  private _selectedCountry: SkyPhoneFieldCountry;

  constructor(
    private formBuilder: FormBuilder,
    private adapterService: SkyPhoneFieldAdapterService,
    private changeDetector: ChangeDetectorRef
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
    this.defaultCountryData = this.countries.find(country => country.iso2 === 'us');
    this.selectedCountry = this.defaultCountryData;

    this.countrySearchForm = this.formBuilder.group({
      countrySearch: new FormControl()
    });
  }

  public ngOnInit(): void {
    if (!this.defaultCountry) {
      this.defaultCountry = 'us';
    } else {
      this.selectedCountry = this.defaultCountryData;
    }

    this.countrySearchForm.get('countrySearch').valueChanges.subscribe(newValue => {
      if (newValue) {
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
   */
  public onCountrySelected(newCountry: SkyAutocompleteSelectionChange): void {
    if (newCountry.selectedItem) {
      this.selectedCountry = this.countries.find(countryInfo => countryInfo.iso2 ===
        newCountry.selectedItem.iso2);
      this.toggleCountrySearch(false);
    }
  }

  public toggleCountrySearch(showSearch: boolean): void {
    if (showSearch) {
      this.phoneInputShown = false;
    } else {
      this.countrySearchShown = false;

      this.countrySearchForm.get('countrySearch').setValue(undefined);
    }
  }

  public countrySearchAnimationEnd() {
    if (!this.countrySearchShown) {
      this.phoneInputShown = true;
    } else {
      this.adapterService.focusElement(this.countrySearchInput.nativeElement);
    }
  }

  public phoneInputAnimationEnd() {
    if (!this.phoneInputShown) {
      this.countrySearchShown = true;
    } else {
      if (this.intialLoad) {
        this.intialLoad = false;
      } else {
        this.adapterService.focusPhoneInput();
      }
    }
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

  private sortCountriesWithSelectedAndDefault(selectedCountry: SkyPhoneFieldCountry): void {
    this.countries.splice(this.countries.indexOf(selectedCountry), 1);

    let sortedNewCountries = this.countries
      .sort((a, b) => {
        if ((a === this.defaultCountryData || a.name < b.name) && b !== this.defaultCountryData) {
          return -1;
        } else {
          return 1;
        }
      });

    sortedNewCountries.splice(0, 0, selectedCountry);
    this.countries = sortedNewCountries;
  }

}
