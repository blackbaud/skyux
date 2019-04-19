import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Input
} from '@angular/core';

require('intl-tel-input/build/js/utils');

require('intl-tel-input/build/js/intlTelInput');

/**
 * NOTE: We can not type these due the the current @types/intl-tel-input version having an
 * undeclared type which causes linting errors.
 */
declare var intlTelInputUtils: any;
declare var intlTelInputGlobals: any;

import {
  SkyPhoneFieldCountry
} from './types';

@Component({
  selector: 'sky-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyPhoneFieldComponent implements OnDestroy, OnInit {

  @Input()
  public set defaultCountry(value: string) {
    if (value !== this._defaultCountry) {
      this._defaultCountry = value;

      this.defaultCountryData = this.countries.find(country => country.iso2 === value);
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

  public set selectedCountry(newCountry: SkyPhoneFieldCountry) {
    if (this._selectedCountry !== newCountry) {
      this._selectedCountry = newCountry;

      if (!this._selectedCountry.exampleNumber) {
        this._selectedCountry.exampleNumber = intlTelInputUtils.getExampleNumber(
          newCountry.iso2,
          true,
          intlTelInputUtils.numberType.FIXED_LINE
        );
      }

      this.sortCountriesWithSelectedAndDefault(newCountry);

      this.selectedCountryChange.emit(newCountry);
    }
  }

  public get selectedCountry(): SkyPhoneFieldCountry {
    return this._selectedCountry;
  }

  private defaultCountryData: SkyPhoneFieldCountry;

  private _defaultCountry: string;

  private _selectedCountry: SkyPhoneFieldCountry;

  constructor() {
    /**
     * The "slice" here ensures that we get a copy of the array and not the global original. This
     * ensures that multiple instances of the component don't overwrite the original data.
     */
    this.countries = intlTelInputGlobals.getCountryData().slice(0);
    this.defaultCountryData = this.countries.find(country => country.iso2 === 'us');
    this.selectedCountry = this.defaultCountryData;
  }

  public ngOnInit(): void {
    if (!this.defaultCountry) {
      this.defaultCountry = 'us';
    } else {
      this.selectedCountry = this.defaultCountryData;
    }
  }

  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param countryCode The International Organization for Standardization's two-letter code
   * for the default country.
   */
  public onCountrySelected(countryCode: string): void {
    this.selectedCountry = this.countries.find(countryInfo => countryInfo.iso2 === countryCode);
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
