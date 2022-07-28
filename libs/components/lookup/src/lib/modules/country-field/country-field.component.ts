import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  Type,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NgControl,
  NgModel,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyThemeService } from '@skyux/theme';

import 'intl-tel-input';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAutocompleteInputDirective } from '../autocomplete/autocomplete-input.directive';
import { SkyAutocompleteSelectionChange } from '../autocomplete/types/autocomplete-selection-change';

import { SkyCountryFieldCountry } from './types/country';

const DEFAULT_COUNTRY_CODE = 'us';

const SKY_COUNTRY_FIELD_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyCountryFieldComponent),
  multi: true,
};

let uniqueId = 0;

@Component({
  selector: 'sky-country-field',
  templateUrl: './country-field.component.html',
  styleUrls: ['./country-field.component.scss'],
  providers: [SKY_COUNTRY_FIELD_VALIDATOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCountryFieldComponent
  implements AfterViewInit, ControlValueAccessor, OnDestroy, OnInit, Validator
{
  /**
   * Specifies the value for the `autocomplete` attribute on the form input.
   * @default "off"
   */
  @Input()
  public autocompleteAttribute: string | undefined;

  /**
   * Specifies the [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country.
   * When search results include the default country, it appears at the top of the list.
   * @default "us"
   */
  @Input()
  public set defaultCountry(value: string | undefined) {
    if (!value) {
      value = DEFAULT_COUNTRY_CODE;
    }

    if (value !== this.#_defaultCountry) {
      this.#_defaultCountry = value.toLowerCase();

      this.#defaultCountryData = this.countries.find(
        (country) => country.iso2 === this.#_defaultCountry
      );

      this.#sortCountriesWithSelectedAndDefault(this.selectedCountry);
    }
  }

  public get defaultCountry(): string | undefined {
    return this.#_defaultCountry;
  }

  /**
   * Indicates whether to disable the country field.
   * @default false
   */
  @Input()
  public set disabled(isDisabled: boolean) {
    this.#removeEventListeners();

    if (!isDisabled) {
      this.addEventListeners();
    }

    this.#_disabled = isDisabled;

    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Indicates whether to hide the flag in the input element.
   */
  @Input()
  public hideSelectedCountryFlag = false;

  /**
   * Indicates whether to include phone information in the selected country and country dropdown.
   * @default false
   */
  @Input()
  public set includePhoneInfo(value: boolean) {
    this.#_includePhoneInfo = value;

    this.#setupCountries();
  }

  public get includePhoneInfo(): boolean {
    return this.#_includePhoneInfo || false;
  }

  /**
   * Specifies the [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country codes for the countries that users can select. By default, all countries are available.
   */
  @Input()
  public set supportedCountryISOs(value: string[] | undefined) {
    // Ensure all values are the same case.
    if (Array.isArray(value)) {
      value = value.map((v) => v.toLowerCase());
    }

    this.#_supportedCountryISOs = value;
    this.#setupCountries();
  }

  public get supportedCountryISOs(): string[] {
    return this.#_supportedCountryISOs || [];
  }

  /**
   * Fires when the selected country changes.
   */
  @Output()
  public selectedCountryChange: EventEmitter<SkyCountryFieldCountry> = new EventEmitter<SkyCountryFieldCountry>();

  public countries: SkyCountryFieldCountry[] = [];

  public countrySearchFormControl: FormControl;

  public isInputFocused = false;

  public searchTextMinimumCharacters = 2;

  @ViewChild(SkyAutocompleteInputDirective)
  public countrySearchAutocompleteDirective:
    | SkyAutocompleteInputDirective
    | undefined;

  public set selectedCountry(newCountry: SkyCountryFieldCountry | undefined) {
    if (!this.#countriesAreEqual(this.selectedCountry, newCountry)) {
      const newCountryIso = newCountry && newCountry.iso2;
      if (newCountryIso) {
        const isoCountry = this.countries.find(
          (country) => country.iso2 === newCountryIso
        );

        if (isoCountry) {
          newCountry = isoCountry;
        }
      }

      this.#_selectedCountry = newCountry;

      this.#sortCountriesWithSelectedAndDefault(newCountry);

      this.#internalFormChange = true;
      this.countrySearchFormControl.setValue(this.selectedCountry);

      if (!this.#isInitialChange) {
        this.onChange(newCountry);
        this.onTouched();

        this.selectedCountryChange.emit(newCountry);
      }

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.#isInitialChange && this.#ngControl && this.#ngControl.control) {
        this.#ngControl.control.markAsPristine();
      }

      this.#isInitialChange = false;

      /**
       * The second portion of this if statement is complex. The control type check ensures that
       * we only watch for the initial time through this function on reactive forms. However,
       * template forms will send through `null` and then `undefined` on empty initialization
       * so we have to check for when the non-null pass through happens.
       */
    } else if (
      this.#isInitialChange &&
      (!(this.#ngControl instanceof NgModel) || newCountry !== null)
    ) {
      this.#isInitialChange = false;
    }
  }

  public get selectedCountry(): SkyCountryFieldCountry | undefined {
    return this.#_selectedCountry;
  }

  public currentTheme = 'default';

  public inputId: string;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  private inputTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('searchIconTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  private searchIconTemplateRef: TemplateRef<unknown> | undefined;

  #changeDetector: ChangeDetectorRef;

  #defaultCountryData: SkyCountryFieldCountry | undefined;

  #elRef: ElementRef;

  #idle = new Subject<void>();

  #injector: Injector;

  #internalFormChange = false;

  #isInitialChange = true;

  #ngControl: NgControl | null = null;

  #ngUnsubscribe = new Subject<void>();

  #themeSvc: SkyThemeService | undefined;

  #windowRef: SkyAppWindowRef;

  #_defaultCountry: string | undefined;

  #_disabled = false;

  #_includePhoneInfo = false;

  #_selectedCountry: SkyCountryFieldCountry | undefined;

  #_supportedCountryISOs: string[] | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    elRef: ElementRef,
    windowRef: SkyAppWindowRef,
    injector: Injector,
    @Optional() public inputBoxHostSvc?: SkyInputBoxHostService,
    @Optional() themeSvc?: SkyThemeService
  ) {
    this.#changeDetector = changeDetector;
    this.#elRef = elRef;
    this.#windowRef = windowRef;
    this.#injector = injector;
    this.#themeSvc = themeSvc;

    this.inputId = `sky-country-field-input-${uniqueId++}`;

    this.#setupCountries();

    this.countrySearchFormControl = new FormControl();
  }

  /**
   * Angular lifecycle hook for when the component is initialized
   * @internal
   */
  public ngOnInit(): void {
    this.#updateInputBox();

    this.#ngControl = this.#injector.get<NgControl | null>(
      NgControl as unknown as Type<NgControl>,
      null
    );

    if (this.#ngControl) {
      this.#ngControl.valueAccessor = this;
    } else {
      /**
       * The initial change boolean is to determine if the form is setting the value. When no form
       * is present we don't want to ignore the first change.
       */
      this.#isInitialChange = false;
    }

    if (!this.defaultCountry) {
      this.defaultCountry = DEFAULT_COUNTRY_CODE;
    }

    this.countrySearchFormControl.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((newValue) => {
        if (newValue && !this.#internalFormChange) {
          this.selectedCountry = newValue;
        }
      });

    if (!this.disabled) {
      this.addEventListeners();
    }
  }

  public ngAfterViewInit(): void {
    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange.subscribe((change) => {
        this.currentTheme = change.currentSettings.theme.name;
        this.#updateInputBox();
        this.#changeDetector.markForCheck();
      });
    }
  }

  /**
   * Angular lifecycle hook for when the compoennt is destructed.
   * @internal
   */
  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
    this.#removeEventListeners();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
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
      this.writeValue(
        this.countries.find(
          (countryInfo) => countryInfo.iso2 === newCountry.selectedItem.iso2
        )
      );
    } else {
      this.writeValue(undefined);
    }
  }

  // Angular automatically constructs these methods.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange = (value: SkyCountryFieldCountry | undefined) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = () => {};

  public registerOnChange(
    fn: (value: SkyCountryFieldCountry | undefined) => void
  ): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if (
        (this.supportedCountryISOs &&
          this.supportedCountryISOs.length > 0 &&
          this.supportedCountryISOs.indexOf(control.value.iso2) < 0) ||
        !this.countries.find((country) => country.iso2 === control.value.iso2)
      ) {
        return { unsupportedCountry: true };
      }
    }

    return null;
  }

  public writeValue(value: SkyCountryFieldCountry | undefined): void {
    this.selectedCountry = value;
    this.#changeDetector.markForCheck();
  }

  private addEventListeners(): void {
    this.#removeEventListeners();

    this.#idle = new Subject();

    const documentObj = this.#windowRef.nativeWindow.document;

    fromEvent<MouseEvent>(documentObj, 'mousedown')
      .pipe(takeUntil(this.#idle))
      .subscribe((event) => {
        this.isInputFocused = this.#elRef.nativeElement.contains(event.target);
        this.#changeDetector.markForCheck();
      });

    fromEvent<KeyboardEvent>(documentObj, 'focusin')
      .pipe(takeUntil(this.#idle))
      .subscribe((event) => {
        this.isInputFocused = this.#elRef.nativeElement.contains(event.target);
        this.#changeDetector.markForCheck();
      });
  }

  #countriesAreEqual(
    country1: SkyCountryFieldCountry | undefined,
    country2: SkyCountryFieldCountry | undefined
  ): boolean {
    if (country1 && country2) {
      return country1.iso2 === country2.iso2;
    }

    // NOTE: We are doing this in  this way because template forms will send through `null`
    // and then `undefined` on empty initialization. These are functionally equivalent but will
    // not pass a standard triple equals check.
    return !country1 && !country2;
  }

  #countriesEqual(
    a: SkyCountryFieldCountry,
    b: SkyCountryFieldCountry
  ): boolean {
    return a.iso2 === b.iso2 && a.name === b.name;
  }

  #removeEventListeners(): void {
    this.#idle.next();
    this.#idle.complete();
  }

  #setupCountries(): void {
    /**
     * The json functions here ensures that we get a copy of the array and not the global original.
     * This ensures that multiple instances of the component don't overwrite the original data.
     *
     * We must type the window object as any here as the intl-tel-input library adds its object
     * to the main window object.
     */
    this.countries = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      JSON.stringify((window as any).intlTelInputGlobals.getCountryData())
    );

    // Ignoring coverage here as this will be removed in the next release.
    // istanbul ignore next
    if (!this.includePhoneInfo && !this.hideSelectedCountryFlag) {
      if (
        (
          this.#elRef.nativeElement.parentElement as HTMLElement
        )?.classList?.contains('sky-phone-field-country-search')
      ) {
        this.includePhoneInfo = true;
        this.hideSelectedCountryFlag = true;
      }
    }

    /* istanbul ignore else */
    if (!this.includePhoneInfo) {
      /**
       * The library we get the country data from includes extra phone properties.
       * We want to remove these unless we are in a phone field
       */
      this.countries.forEach((country) => {
        delete country.dialCode;
        delete country.areaCodes;
        delete country.priority;
      });
    }

    this.#sortCountriesWithSelectedAndDefault(this.selectedCountry);

    if (this.supportedCountryISOs && this.supportedCountryISOs.length > 0) {
      this.countries = this.countries.filter(
        (country: SkyCountryFieldCountry) => {
          return this.supportedCountryISOs.indexOf(country.iso2) >= 0;
        }
      );
    }
  }

  #sortCountriesWithSelectedAndDefault(
    selectedCountry: SkyCountryFieldCountry | undefined
  ): void {
    let selectedCountryIndex: number;
    let selectedCountryData: SkyCountryFieldCountry;

    const sortedNewCountries = this.countries.sort((a, b) => {
      if (
        ((this.#defaultCountryData &&
          this.#countriesEqual(a, this.#defaultCountryData)) ||
          a.name! < b.name!) &&
        (!this.#defaultCountryData ||
          !this.#countriesEqual(this.#defaultCountryData, b))
      ) {
        return -1;
      } else {
        return 1;
      }
    });

    if (selectedCountry) {
      // Note: We are looking up this data here to ensure we are using the offical data from the
      // library and not the data provided by the user on initialization of the component
      const foundCountry = this.countries.find(
        (country) => country.iso2 === selectedCountry.iso2.toLocaleLowerCase()
      );

      if (foundCountry) {
        selectedCountryData = foundCountry;
        selectedCountryIndex = this.countries.indexOf(selectedCountryData);

        if (selectedCountryIndex >= 0) {
          this.countries.splice(selectedCountryIndex, 1);
          sortedNewCountries.splice(0, 0, selectedCountryData);
        }
      }
    }

    this.countries = sortedNewCountries;
  }

  #updateInputBox(): void {
    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputBoxHostSvc.populate({
        inputTemplate: this.inputTemplateRef,
        iconsInsetTemplate:
          this.currentTheme === 'modern'
            ? this.searchIconTemplateRef
            : undefined,
      });
    }
  }
}
