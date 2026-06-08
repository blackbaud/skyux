import { coerceStringArray } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterRenderRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SkyAppFormat } from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyAppLocaleProvider, SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import {
  SKY_COUNTRY_FIELD_CONTEXT,
  SkyCountryFieldCountry,
  SkyCountryFieldModule,
} from '@skyux/lookup';
import { SkyThemeModule } from '@skyux/theme';

import {
  PhoneNumberFormat,
  PhoneNumberType,
  PhoneNumberUtil,
} from 'google-libphonenumber';
import intlTelInput from 'intl-tel-input';
import { Subject, map, takeUntil } from 'rxjs';

import { SkyPhoneFieldResourcesModule } from '../shared/sky-phone-field-resources.module';

import { cloneCountryData } from './clone-country-data';
import { SkyPhoneFieldAdapterService } from './phone-field-adapter.service';
import { SkyPhoneFieldCountry } from './types/country';
import { SkyPhoneFieldNumberReturnFormat } from './types/number-return-format';

const DEFAULT_COUNTRY_CODE = 'us';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyIconModule,
    SkyPhoneFieldResourcesModule,
    SkyThemeModule,
  ],
  selector: 'sky-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SkyPhoneFieldAdapterService,
    // Prevents the embedded country field component from changing its behavior based on
    // being inside an input box. The phone field itself will handle the required changes
    // for input box.
    {
      provide: SkyInputBoxHostService,
      useValue: undefined,
    },
    {
      provide: SKY_COUNTRY_FIELD_CONTEXT,
      useValue: { inPhoneField: true },
    },
  ],
})
export class SkyPhoneFieldComponent implements OnDestroy {
  /**
   * Whether phone number extensions are allowed.
   * @default true
   */
  public readonly allowExtensions = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  /**
   * The
   * [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country. The country selector button displays a flag
   * icon for this default country until users select a different country.
   * @default "us"
   */
  public readonly defaultCountry = input<string, unknown>(
    DEFAULT_COUNTRY_CODE,
    {
      transform: (value) => String(value || DEFAULT_COUNTRY_CODE).toLowerCase(),
    },
  );

  /**
   * The format for validated phone numbers.
   * Options include: `"default"`, `"international"`, and `"national"`.
   * @default "default"
   */
  public readonly returnFormat =
    input<SkyPhoneFieldNumberReturnFormat>('default');

  /**
   * The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country codes for the countries that users can select. By default, all countries are available.
   */
  public readonly supportedCountryISOs = input<string[], unknown>([], {
    transform: coerceStringArray,
  });

  /**
   * Emits a `SkyPhoneFieldCountry` object when the selected country in the country search
   * input changes.
   */
  public readonly selectedCountryChange = output<SkyPhoneFieldCountry>();

  public readonly countries = computed<SkyPhoneFieldCountry[]>(() => {
    const countries = cloneCountryData(
      intlTelInput.getCountryData(),
      this.#locale(),
    );

    for (const country of countries) {
      country.dialCode = '+' + country.dialCode;
    }
    return countries;
  });

  public readonly countrySelectDisabled = signal(false);

  public readonly countrySearchShown = signal(false);

  public countrySearchForm: FormGroup<{
    countrySearch: FormControl<SkyCountryFieldCountry | undefined | null>;
  }>;

  public readonly inputBoxHostSvc = inject(SkyInputBoxHostService, {
    optional: true,
    skipSelf: true,
  });

  /**
   * The currently selected country to validate against.
   */
  public readonly selectedCountry = model<SkyPhoneFieldCountry | undefined>();

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public inputTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('countryBtnTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public countryBtnTemplateRef: TemplateRef<unknown> | undefined;

  @ViewChild('buttonsInsetTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public buttonsInsetTemplateRef: TemplateRef<unknown> | undefined;

  readonly #defaultCountryData = computed(() => {
    const defaultCountry = this.defaultCountry();
    return this.countries().find((country) => country.iso2 === defaultCountry);
  });

  #focusPhoneInputAfterToggle = false;

  #phoneNumberFormatHintTextTemplateString = '';

  #phoneUtils = PhoneNumberUtil.getInstance();

  readonly #longestDialCodeLength = computed(() => {
    const countries = this.countries();
    return countries
      .map((country) => Number(country.dialCode?.length))
      .filter(Boolean)
      .reduce(
        (max, dialCodeLength) => (dialCodeLength > max ? dialCodeLength : max),
        0,
      );
  });

  readonly #selectedCountryData = computed(() => {
    const selected = this.selectedCountry();

    return selected
      ? this.countries().find((c) => c.iso2 === selected.iso2)
      : undefined;
  });

  #countrySearchFormControl = new FormControl<
    SkyCountryFieldCountry | undefined | null
  >(undefined);

  #afterRenderRef: AfterRenderRef | undefined;
  #countryFlagFocusListenerFn: (() => void) | undefined;
  #dismissCountrySearchFocusListenerFn: (() => void) | undefined;

  readonly #appFormat = inject(SkyAppFormat);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #injector = inject(Injector);
  readonly #ngUnsubscribe = new Subject<void>();
  readonly #resourceSvc = inject(SkyLibResourcesService);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #renderer = inject(Renderer2);
  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((loc) => loc.locale)),
    {
      initialValue: this.#localeProvider.defaultLocale,
    },
  );

  constructor() {
    this.countrySearchForm = new FormGroup({
      countrySearch: this.#countrySearchFormControl,
    });

    this.#resourceSvc
      .getString('skyux_phone_field_format_hint_text')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((templateString) => {
        this.#phoneNumberFormatHintTextTemplateString = templateString;
        this.#populateInputBoxHelpText();
      });

    let previousIso: string | undefined;

    effect(() => {
      const country = this.#selectedCountryData();

      if (country && !country.exampleNumber) {
        const numberObj = this.#phoneUtils.getExampleNumberForType(
          country.iso2,
          PhoneNumberType.FIXED_LINE,
        );

        country.exampleNumber = this.#phoneUtils.format(
          numberObj,
          PhoneNumberFormat.NATIONAL,
        );
      }

      this.#populateInputBoxHelpText();

      // Only emit when the selected country actually changes, not when locale
      // changes cause #selectedCountryData to return a new object reference.
      if (country && country.iso2 !== previousIso) {
        this.selectedCountryChange.emit(country);
      }

      previousIso = country?.iso2;
    });

    // Defer initial setup to avoid ExpressionChangedAfterItHasBeenCheckedError
    // when a selected country is set during component initialization.
    afterNextRender(() => {
      if (this.inputBoxHostSvc && this.inputTemplateRef) {
        this.inputBoxHostSvc.populate({
          inputTemplate: this.inputTemplateRef,
          buttonsInsetTemplate: this.buttonsInsetTemplateRef,
          buttonsLeftTemplate: this.countryBtnTemplateRef,
        });
      }

      this.selectedCountry.update(
        (value) => value ?? this.#defaultCountryData(),
      );

      this.#changeDetector.markForCheck();
    });

    this.#countrySearchFormControl.valueChanges
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((newValue: SkyCountryFieldCountry | undefined | null) => {
        if (newValue && newValue.iso2 !== this.selectedCountry()?.iso2) {
          this.selectedCountry.set(newValue);
        }
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#afterRenderRef?.destroy();
    this.#countryFlagFocusListenerFn?.();
    this.#dismissCountrySearchFocusListenerFn?.();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param newCountry The International Organization for Standardization's two-letter code
   * for the default country.
   * @internal
   */
  public onCountrySelected(newCountry: SkyCountryFieldCountry): void {
    if (newCountry) {
      this.selectedCountry.set(
        this.countries().find(
          (countryInfo) => countryInfo.iso2 === newCountry.iso2,
        ),
      );

      this.#focusPhoneInputAfterToggle = true;
      this.toggleCountrySearch(false);
    }
  }

  public toggleCountrySearch(showSearch: boolean): void {
    if (showSearch === this.countrySearchShown()) {
      return;
    }

    if (!showSearch) {
      this.#countrySearchFormControl.setValue(undefined);
    }

    this.countrySearchShown.set(showSearch);

    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputBoxHostSvc.setHintTextHidden(showSearch);
    }

    this.#afterRenderRef?.destroy();
    this.#afterRenderRef = afterNextRender(
      () => {
        if (this.countrySearchShown()) {
          this.#focusCountrySearch();
        } else {
          this.#handlePhoneInputShown();
        }
      },
      { injector: this.#injector },
    );
  }

  // TODO: remove this if no longer needed after a scalable focus monitor service is implemented
  public onCountryFieldFocusout({ relatedTarget }: FocusEvent): void {
    if (this.inputBoxHostSvc && relatedTarget) {
      if (!this.inputBoxHostSvc.focusIsInInput(relatedTarget)) {
        this.toggleCountrySearch(false);
      }
    } else {
      if (!this.#elementRef.nativeElement.contains(relatedTarget)) {
        this.toggleCountrySearch(false);
      }
    }
  }

  #focusCountrySearch(): void {
    this.#queryElement('textarea')?.focus();

    const countryFlagButton = this.#queryElement(
      'button.sky-phone-field-country-select-btn',
    );

    const dismissCountrySearchButton = this.#queryElement(
      'button.sky-phone-field-search-btn-dismiss',
    );

    if (countryFlagButton && dismissCountrySearchButton) {
      this.#countryFlagFocusListenerFn =
        this.addFocusEventListener(countryFlagButton);
      this.#dismissCountrySearchFocusListenerFn = this.addFocusEventListener(
        dismissCountrySearchButton,
      );
    }
  }

  public dismissButtonClicked(): void {
    this.#focusPhoneInputAfterToggle = true;
    this.toggleCountrySearch(false);
  }

  #handlePhoneInputShown(): void {
    if (this.#focusPhoneInputAfterToggle) {
      this.#queryElement('.sky-phone-field-container input')?.focus();

      this.#focusPhoneInputAfterToggle = false;
    }

    // Remove focus out event listeners now that country search is closed.
    this.#countryFlagFocusListenerFn?.();
    this.#dismissCountrySearchFocusListenerFn?.();
  }

  // TODO: remove this if no longer needed after a scalable focus monitor service is implemented
  private addFocusEventListener(el: HTMLElement): () => void {
    return this.#renderer.listen(el, 'focusout', (event: FocusEvent) => {
      const target = event.relatedTarget;
      if (this.inputBoxHostSvc && target) {
        if (!this.inputBoxHostSvc.focusIsInInput(target)) {
          this.toggleCountrySearch(false);
        }
      } else {
        if (!this.#elementRef.nativeElement.contains(target)) {
          this.toggleCountrySearch(false);
        }
      }
    });
  }

  public setCountryByDialCode(phoneNumberRaw: string | undefined): void {
    if (!phoneNumberRaw || !phoneNumberRaw.startsWith('+')) {
      return;
    }

    let foundCountry: SkyPhoneFieldCountry | undefined;

    try {
      const phoneNumberParsed =
        this.#phoneUtils.parseAndKeepRawInput(phoneNumberRaw);

      const regionCode =
        this.#phoneUtils.getRegionCodeForNumber(phoneNumberParsed);

      if (regionCode !== undefined) {
        foundCountry = this.countries().find(
          (country) => country.iso2.toUpperCase() === regionCode.toUpperCase(),
        );
      }
    } catch {
      foundCountry ??= this.#findCountryByDialCode(phoneNumberRaw);
    }

    if (foundCountry && !this.#validateSupportedCountry(foundCountry)) {
      foundCountry = undefined;
    }

    if (foundCountry && foundCountry !== this.#selectedCountryData()) {
      this.selectedCountry.set(foundCountry);
      this.#changeDetector.markForCheck();
    }
  }

  #findCountryByDialCode(
    phoneNumberRaw: string,
  ): SkyPhoneFieldCountry | undefined {
    const defaultDialCode = this.#defaultCountryData()?.dialCode;
    const selectedCountryDialCode = this.#selectedCountryData()?.dialCode;
    const countries = this.countries();

    let foundCountry: SkyPhoneFieldCountry | undefined;

    if (
      !selectedCountryDialCode ||
      !phoneNumberRaw.startsWith(selectedCountryDialCode)
    ) {
      for (let i = 1; i < this.#longestDialCodeLength() + 1; i++) {
        const dialCode = phoneNumberRaw.substring(0, i);

        if (defaultDialCode === dialCode) {
          foundCountry = this.#defaultCountryData();
        } else if (selectedCountryDialCode !== dialCode) {
          const dialCodeCountries = countries.filter(
            (country) => country.dialCode === dialCode,
          );

          if (dialCodeCountries.length > 0) {
            foundCountry =
              dialCodeCountries.find((country) => country.priority === 0) ??
              dialCodeCountries[0];
          }
        }
      }
    }

    return foundCountry;
  }

  #queryElement(selector: string): HTMLElement | undefined {
    return (
      this.inputBoxHostSvc?.queryHost(selector) ??
      (this.#elementRef.nativeElement.querySelector(selector) as
        | HTMLElement
        | undefined)
    );
  }

  #populateInputBoxHelpText(): void {
    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputBoxHostSvc.setHintText(
        this.#appFormat.formatText(
          this.#phoneNumberFormatHintTextTemplateString,
          this.#selectedCountryData()?.exampleNumber,
        ),
      );
    }
  }

  #validateSupportedCountry(country: SkyPhoneFieldCountry): boolean {
    const supported = this.supportedCountryISOs();
    return (
      supported.length === 0 ||
      supported.some(
        (isoCode) => isoCode.toUpperCase() === country.iso2.toUpperCase(),
      )
    );
  }
}
