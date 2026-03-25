import { coerceStringArray } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  Type,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NgControl,
  NgModel,
  UntypedFormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import intlTelInput from 'intl-tel-input';
import { Observable, Subject, map } from 'rxjs';

import { SkyAutocompleteInputDirective } from '../autocomplete/autocomplete-input.directive';
import { SkyAutocompleteSelectionChange } from '../autocomplete/types/autocomplete-selection-change';

import { cloneCountryData } from './clone-country-data';
import { SkyCountryFieldCountry } from './types/country';
import { SkyCountryFieldContext } from './types/country-field-context';
import { SKY_COUNTRY_FIELD_CONTEXT } from './types/country-field-context-token';

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
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyCountryFieldComponent
  implements ControlValueAccessor, OnDestroy, OnInit, Validator
{
  /**
   * The value for the HTML `autocomplete` attribute on the form input.
   * @default 'off'
   * @deprecated SKY UX only supports browser autofill on components where the direct input matches the return value. This input may not behave as expected due to the dropdown selection interaction.
   */
  public autocompleteAttribute = input<string>();

  /**
   * The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country.
   * When search results include the default country, it appears at the top of the list.
   * @default "us"
   */
  public readonly defaultCountry = input<string, unknown>(
    DEFAULT_COUNTRY_CODE,
    {
      transform: (value) => String(value || DEFAULT_COUNTRY_CODE).toLowerCase(),
    },
  );

  /**
   * Whether to disable the country field on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(isDisabled: boolean | undefined) {
    this.#_disabled = isDisabled ?? false;

    if (isDisabled) {
      this.countrySearchFormControl.disable();
    } else {
      this.countrySearchFormControl.enable();
    }

    this.#changeDetector.markForCheck();
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country codes for the countries that users can select. By default, all countries are available.
   */
  public readonly supportedCountryISOs = input<string[], unknown>([], {
    transform: (value) => coerceStringArray(value).map((v) => v.toLowerCase()),
  });

  /**
   * Fires when the selected country changes.
   */
  public readonly selectedCountryChange = output<SkyCountryFieldCountry>();

  /**
   * Fires when the country field is focused out.
   * @internal
   */
  // TODO: remove this if no longer needed after a scalable focus monitor service is implemented
  public countryFieldFocusout = output<FocusEvent>();

  public readonly countries = computed(() => this.#setupCountries());

  public readonly countrySearchFormControl = new UntypedFormControl();

  public searchTextMinimumCharacters = 2;

  @ViewChild(SkyAutocompleteInputDirective)
  public countrySearchAutocompleteDirective:
    | SkyAutocompleteInputDirective
    | undefined;

  public context: SkyCountryFieldContext | null = inject(
    SKY_COUNTRY_FIELD_CONTEXT,
    {
      optional: true,
    },
  );

  public inputId = `sky-country-field-input-${uniqueId++}`;
  protected ariaDescribedBy: Observable<string | undefined> | undefined;

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  public readonly inputBoxHostSvc = inject(SkyInputBoxHostService, {
    optional: true,
  });

  readonly #changeDetector = inject(ChangeDetectorRef);

  #defaultCountryData: SkyCountryFieldCountry | undefined;

  readonly #injector = inject(Injector);

  #isInitialChange = true;

  #ngControl: NgControl | null = null;

  readonly #ngUnsubscribe = new Subject<void>();

  #_disabled = false;

  readonly #_selectedCountry = signal<SkyCountryFieldCountry | undefined>(
    undefined,
  );
  readonly #_selectedIsoCountry = computed(
    () => {
      let selectedCountry = this.#_selectedCountry();
      const selectedCountryIso = selectedCountry?.iso2?.toLowerCase();
      if (selectedCountryIso) {
        const isoCountry = this.countries().find(
          (country) => country.iso2 === selectedCountryIso,
        );
        if (isoCountry) {
          selectedCountry = isoCountry;
        }
      }
      return selectedCountry;
    },
    {
      equal: (a, b) => a?.name === b?.name,
    },
  );

  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((loc) => loc.locale)),
    {
      initialValue: this.#localeProvider.defaultLocale,
    },
  );

  constructor() {
    // Sync the form control with the resolved selected country.
    // This handles locale changes and ISO normalization reactively.
    effect(() => {
      const newCountry = this.#_selectedIsoCountry();
      this.countrySearchFormControl.setValue(newCountry);
    });
  }

  /**
   * Angular lifecycle hook for when the component is initialized
   * @internal
   */
  public ngOnInit(): void {
    this.#updateInputBox();

    this.#ngControl = this.#injector.get<NgControl | null>(
      NgControl as unknown as Type<NgControl>,
      null,
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

    this.#changeDetector.markForCheck();
  }

  /**
   * Angular lifecycle hook for when the component is destructed.
   * @internal
   */
  public ngOnDestroy(): void {
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
        this.countries().find(
          (countryInfo) => countryInfo.iso2 === newCountry.selectedItem.iso2,
        ),
      );
    } else {
      this.writeValue(undefined);
    }
  }

  /**
   * Called when the Autocomplete textarea loses focus
   * @internal
   */
  public onAutocompleteFocusout(e: FocusEvent): void {
    this.countryFieldFocusout.emit(e);
  }

  // Angular automatically constructs these methods.
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  public onChange = (value: SkyCountryFieldCountry | undefined): void => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched = (): void => {};

  public registerOnChange(
    fn: (value: SkyCountryFieldCountry | undefined) => void,
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
      const supportedCountryISOs = this.supportedCountryISOs();
      const valueIso2 = control.value.iso2?.toLowerCase();
      if (
        (supportedCountryISOs.length > 0 &&
          supportedCountryISOs.indexOf(valueIso2) < 0) ||
        !this.countries().find((country) => country.iso2 === valueIso2)
      ) {
        return { unsupportedCountry: true };
      }
    }

    return null;
  }

  public writeValue(value: SkyCountryFieldCountry | undefined): void {
    const current = this.#_selectedIsoCountry();
    if (!this.#countriesAreEqual(current, value)) {
      this.#_selectedCountry.set(value);

      if (!this.#isInitialChange) {
        const resolved = this.#_selectedIsoCountry();
        this.onChange(resolved);
        this.onTouched();

        if (resolved) {
          this.selectedCountryChange.emit(resolved);
        }
      } else if (this.#ngControl?.control) {
        // Do not mark the field as "dirty"
        // if the field has been initialized with a value.
        this.#ngControl.control.markAsPristine();
      }

      this.#isInitialChange = false;
    } else if (!(this.#ngControl instanceof NgModel) || value !== null) {
      this.#isInitialChange = false;
    }

    this.#changeDetector.markForCheck();
  }

  protected onFocus($event: FocusEvent): void {
    ($event.target as HTMLTextAreaElement).select();
  }

  #countriesAreEqual(
    country1: SkyCountryFieldCountry | undefined,
    country2: SkyCountryFieldCountry | undefined,
  ): boolean {
    if (country1 && country2) {
      return country1.iso2 === country2.iso2;
    }

    // NOTE: We are doing this in this way because template forms will send through `null`
    // and then `undefined` on empty initialization. These are functionally equivalent but will
    // not pass a standard triple equals check.
    return !country1 && !country2;
  }

  #countriesEqual(
    a: SkyCountryFieldCountry,
    b: SkyCountryFieldCountry,
  ): boolean {
    return a.iso2 === b.iso2 && a.name === b.name;
  }

  #setupCountries(): SkyCountryFieldCountry[] {
    let countries = cloneCountryData(
      intlTelInput.getCountryData(),
      this.#locale(),
    );

    /* istanbul ignore else */
    if (!this.context?.inPhoneField) {
      /**
       * The library we get the country data from includes extra phone properties.
       * We want to remove these unless we are in a phone field
       */
      countries.forEach((country) => {
        delete country.dialCode;
        delete country.areaCodes;
        delete country.priority;
      });
    }

    const defaultCountry = this.defaultCountry();
    this.#defaultCountryData = countries.find(
      (country) => country.iso2 === defaultCountry,
    );
    countries = this.#sortCountriesWithSelectedAndDefault(countries);

    const supportedCountryISOs = this.supportedCountryISOs();
    if (supportedCountryISOs.length > 0) {
      countries = countries.filter((country: SkyCountryFieldCountry) => {
        return supportedCountryISOs.indexOf(country.iso2) >= 0;
      });
    }
    return countries;
  }

  #sortCountriesWithSelectedAndDefault(
    countries: SkyCountryFieldCountry[],
  ): SkyCountryFieldCountry[] {
    const selectedCountry = this.#_selectedCountry();
    let selectedCountryIndex: number;
    let selectedCountryData: SkyCountryFieldCountry;

    const sortedNewCountries = countries.sort((a, b) => {
      if (
        ((this.#defaultCountryData &&
          this.#countriesEqual(a, this.#defaultCountryData)) ||
          (a.name && b.name && a.name < b.name)) &&
        (!this.#defaultCountryData ||
          !this.#countriesEqual(this.#defaultCountryData, b))
      ) {
        return -1;
      } else {
        return 1;
      }
    });

    if (selectedCountry) {
      // Note: We are looking up this data here to ensure we are using the official data from the
      // library and not the data provided by the user on initialization of the component
      const foundCountry = countries.find(
        (country) => country.iso2 === selectedCountry.iso2.toLowerCase(),
      );

      if (foundCountry) {
        selectedCountryData = foundCountry;
        selectedCountryIndex = countries.indexOf(selectedCountryData);

        if (selectedCountryIndex >= 0) {
          countries.splice(selectedCountryIndex, 1);
          sortedNewCountries.splice(0, 0, selectedCountryData);
        }
      }
    }

    return countries;
  }

  #updateInputBox(): void {
    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputId = this.inputBoxHostSvc.controlId;
      this.ariaDescribedBy = this.inputBoxHostSvc.ariaDescribedBy;

      this.inputBoxHostSvc.populate({
        inputTemplate: this.inputTemplateRef,
      });
    }
  }
}
