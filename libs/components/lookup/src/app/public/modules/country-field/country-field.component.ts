import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Injector,
  Type
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
  NgModel,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

import {
  SkyAppWindowRef
} from '@skyux/core';

import 'intl-tel-input';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyAutocompleteSelectionChange
} from '../autocomplete/types/autocomplete-selection-change';

import {
  SkyAutocompleteInputDirective
} from '../autocomplete/autocomplete-input.directive';

import {
  SkyCountryFieldCountry
} from './types/country';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_COUNTRY_FIELD_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyCountryFieldComponent),
  multi: true
};

// tslint:enable
let uniqueId: number = 0;

@Component({
  selector: 'sky-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
  providers: [
    SKY_COUNTRY_FIELD_VALIDATOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyCountryFieldComponent implements ControlValueAccessor, OnDestroy, OnInit, Validator {

  /**
   * Specifies the value for the `autocomplete` attribute on the form input.
   * @default 'off'
   */
  @Input()
  public autocompleteAttribute: string;

  /**
   * Specifies the [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country.
   * When search results include the default country, it appears at the top of the list.
   * @default us
   */
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

  @Input()
  public set supportedCountryISOs(value: string[]) {
    this._supportedCountryISOs = value;

    if (value && value.length > 0) {
      this.setupCountries();
    }
  }

  public get supportedCountryISOs(): string[] {
    return this._supportedCountryISOs;
  }

  /**
   * Indicates whether to disable the country field.
   */
  @Input()
  public set disabled(isDisabled: boolean) {
    this.removeEventListeners();

    if (!isDisabled) {
      this.addEventListeners();
    }

    this._disabled = isDisabled;

    this.changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Fires when the selected country changes.
   */
  @Output()
  public selectedCountryChange: EventEmitter<SkyCountryFieldCountry> = new EventEmitter<SkyCountryFieldCountry>();

  public countries: SkyCountryFieldCountry[];

  public countrySearchFormControl: FormControl;

  public isInPhoneField: boolean = false;

  public isInputFocused: boolean = false;

  public searchTextMinimumCharacters: number = 2;

  @ViewChild(SkyAutocompleteInputDirective)
  public countrySearchAutocompleteDirective: SkyAutocompleteInputDirective;

  public set selectedCountry(newCountry: SkyCountryFieldCountry) {
    if (this._selectedCountry !== newCountry) {

      if (newCountry && newCountry.iso2) {
        let isoCountry = this.countries.find(country => country.iso2 === newCountry.iso2);

        if (isoCountry) {
          newCountry = isoCountry;
        }
      }

      this._selectedCountry = newCountry;

      this.sortCountriesWithSelectedAndDefault(newCountry);

      this.internalFormChange = true;
      this.countrySearchFormControl.setValue(this.selectedCountry);

      if (!this.isInitialChange) {
        this.onChange(newCountry);
        this.onTouched();

        this.selectedCountryChange.emit(newCountry);
      }

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isInitialChange && this.ngControl && this.ngControl.control) {
        this.ngControl.control.markAsPristine();
      }

      /**
       * The second portion of this if statement is complex. The control type check ensures that
       * we only watch for the initial time through this function on reactive forms. However,
       * template forms will send through `null` and then `undefined` on empty initialization
       * so we have to check for when the non-null pass through happens.
       */
      if (this.isInitialChange && (!(this.ngControl instanceof NgModel) || newCountry !== null)) {
        this.isInitialChange = false;
      }
    } else if (newCountry === undefined) {
      /* Sanity check to ensure we properly handle if a consumer sets the control value to undefined on initialization */
      this.isInitialChange = false;
    }
  }

  public get selectedCountry(): SkyCountryFieldCountry {
    return this._selectedCountry;
  }

  public inputId: string;

  private defaultCountryData: SkyCountryFieldCountry;

  private idle: Subject<any> = new Subject();

  private internalFormChange: boolean = false;

  private isInitialChange: boolean = true;

  private ngControl: NgControl;

  private ngUnsubscribe = new Subject();

  private _defaultCountry: string;

  private _disabled: boolean = false;

  private _selectedCountry: SkyCountryFieldCountry;

  private _supportedCountryISOs: string[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elRef: ElementRef,
    private windowRef: SkyAppWindowRef,
    private injector: Injector
  ) {
    this.setupCountries();

    this.countrySearchFormControl = new FormControl();
  }

  /**
   * Angular lifecycle hook for when the component is initialized
   * @internal
   */
  public ngOnInit(): void {

    // tslint:disable-next-line: no-null-keyword
    this.ngControl = this.injector.get<NgControl>(NgControl as unknown as Type<NgControl>, null);

    this.inputId = `sky-country-field-input-${uniqueId++}`;

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    } else {
      /**
       * The initial change boolean is to determine if the form is setting the value. When no form
       * is present we don't want to ignore the first change.
       */
      this.isInitialChange = false;
    }

    if (!this.defaultCountry) {
      this.defaultCountry = 'us';
    }

    this.countrySearchFormControl.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(newValue => {
        if (newValue && !this.internalFormChange) {
          this.selectedCountry = newValue;
        }
      });

    if (!this.disabled) {
      this.addEventListeners();
    }
  }

  /**
   * Angular lifecycle hook for when the compoennt is destructed.
   * @internal
   */
  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
    this.removeEventListeners();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Sets the component's touched value when the autocomplete is blurred
   * @internal
   */
  public onAutocompleteBlur(): void {
    this.onTouched();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param newCountry The International Organization for Standardization's two-letter code
   * for the default country.
   * @internal
   */
  public onCountrySelected(newCountry: SkyAutocompleteSelectionChange): void {
    if (newCountry.selectedItem) {
      this.writeValue(this.countries.find(countryInfo => countryInfo.iso2 ===
        newCountry.selectedItem.iso2));
    } else {
      this.writeValue(undefined);
    }
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange: Function = (value: SkyCountryFieldCountry) => { };

  /* istanbul ignore next */
  public onTouched: Function = () => { };

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (control.value) {
      if ((this.supportedCountryISOs &&
        this.supportedCountryISOs.length > 0 &&
        this.supportedCountryISOs.indexOf(control.value.iso2) < 0) ||
        !this.countries.find(country => country.iso2 === control.value.iso2)) {
        return { unsupportedCountry: true };
      }
    }
    return;
  }

  public writeValue(value: SkyCountryFieldCountry): void {
    if (!this.disabled) {
      this.selectedCountry = value;
    }
    this.changeDetector.markForCheck();
  }

  private addEventListeners(): void {
    this.removeEventListeners();

    this.idle = new Subject();

    const documentObj = this.windowRef.nativeWindow.document;

    fromEvent(documentObj, 'mousedown')
      .pipe(takeUntil(this.idle))
      .subscribe((event: MouseEvent) => {
        this.isInputFocused = this.elRef.nativeElement.contains(event.target);
        this.changeDetector.markForCheck();
      });

    fromEvent(documentObj, 'focusin')
      .pipe(takeUntil(this.idle))
      .subscribe((event: KeyboardEvent) => {
        this.isInputFocused = this.elRef.nativeElement.contains(event.target);
        this.changeDetector.markForCheck();
      });
  }

  private countriesEqual(a: SkyCountryFieldCountry, b: SkyCountryFieldCountry): boolean {
    return a.iso2 === b.iso2 && a.name === b.name;
  }

  private removeEventListeners(): void {
    this.idle.next();
    this.idle.complete();
  }

  private setupCountries(): void {
    /**
     * The json functions here ensures that we get a copy of the array and not the global original.
     * This ensures that multiple instances of the component don't overwrite the original data.
     *
     * We must type the window object as any here as the intl-tel-input library adds its object
     * to the main window object.
     */
    this.countries = JSON
      .parse(JSON.stringify((window as any)
        .intlTelInputGlobals
        .getCountryData()));

    this.isInPhoneField = (<HTMLElement>this.elRef.nativeElement.parentElement)
      .classList
      .contains('sky-phone-field-country-search');

    /* istanbul ignore else */
    if (!this.isInPhoneField) {
      /**
       * The library we get the country data from includes extra phone properties.
       * We want to remove these unless we are in a phone field
       */
      this.countries.forEach((country: any) => {
        delete country.dialCode;
        delete country.areaCodes;
        delete country.priority;
      });
    }

    this.sortCountriesWithSelectedAndDefault(this.selectedCountry);

    if (this.supportedCountryISOs && this.supportedCountryISOs.length > 0) {
      this.countries = this.countries.filter((country: SkyCountryFieldCountry) => {
        return this.supportedCountryISOs.indexOf(country.iso2) >= 0;
      });
    }
  }

  private sortCountriesWithSelectedAndDefault(selectedCountry: SkyCountryFieldCountry): void {
    let selectedCountryIndex: number;
    let selectedCountryData: SkyCountryFieldCountry;

    let sortedNewCountries = this.countries
      .sort((a, b) => {
        if (((this.defaultCountryData && this.countriesEqual(a, this.defaultCountryData)) ||
          a.name < b.name) && (!this.defaultCountryData || !this.countriesEqual(this.defaultCountryData, b))) {
          return -1;
        } else {
          return 1;
        }
      });

    if (selectedCountry) {
      // Note: We are looking up this data here to ensure we are using the offical data from the
      // library and not the data provided by the user on initialization of the component
      selectedCountryData = this.countries
        .find(country => country.iso2 === selectedCountry.iso2.toLocaleLowerCase());
      selectedCountryIndex = this.countries
        .indexOf(selectedCountryData);

      if (selectedCountryIndex >= 0) {
        this.countries.splice(selectedCountryIndex, 1);
        sortedNewCountries.splice(0, 0, selectedCountryData);
      }
    }

    this.countries = sortedNewCountries;
  }

}
