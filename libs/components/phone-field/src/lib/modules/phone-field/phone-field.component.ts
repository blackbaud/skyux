import {
  AnimationEvent,
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyAppFormat } from '@skyux/core';
import { SkyInputBoxHostService } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import {
  SKY_COUNTRY_FIELD_CONTEXT,
  SkyCountryFieldCountry,
  SkyCountryFieldModule,
} from '@skyux/lookup';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import {
  PhoneNumberFormat,
  PhoneNumberType,
  PhoneNumberUtil,
} from 'google-libphonenumber';
import intlTelInput from 'intl-tel-input';
import { Subject, takeUntil } from 'rxjs';

import { SkyPhoneFieldResourcesModule } from '../shared/sky-phone-field-resources.module';

import { cloneCountryData } from './clone-country-data';
import { SkyPhoneFieldAdapterService } from './phone-field-adapter.service';
import { SkyPhoneFieldCountry } from './types/country';
import { SkyPhoneFieldNumberReturnFormat } from './types/number-return-format';

const DEFAULT_COUNTRY_CODE = 'us';

// NOTE: The no-op animation is here in order to block the input's "fade in" animation
// from firing on initial load. For more information on this technique you can see
// https://www.bennadel.com/blog/3417-using-no-op-transitions-to-prevent-animation-during-the-initial-render-of-ngfor-in-angular-5-2-6.htm
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
  animations: [
    trigger('blockAnimationOnLoad', [transition(':enter', [])]),
    trigger('countrySearchAnimation', [
      transition('void => open', [
        style({
          opacity: 0,
          width: 0,
        }),
        animate(
          '200ms ease-in',
          style({
            opacity: 1,
            width: '*',
          }),
        ),
      ]),
      transition('open => void', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
            width: 0,
          }),
        ),
      ]),
      transition('void => open-modern', [
        style({
          opacity: 0,
        }),
        animate(
          '200ms ease-in',
          style({
            opacity: 1,
          }),
        ),
      ]),
      transition('open-modern => void', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
          }),
        ),
      ]),
    ]),
    trigger('phoneInputAnimation', [
      transition('void => open', [
        style({
          opacity: 0,
        }),
        animate(
          '200ms ease-in',
          style({
            opacity: 1,
          }),
        ),
      ]),
      transition('open => void', [
        animate(
          '200ms ease-in',
          style({
            opacity: 0,
          }),
        ),
      ]),
    ]),
  ],
})
export class SkyPhoneFieldComponent implements OnDestroy, OnInit {
  /**
   * Whether phone number extensions are allowed.
   * @default true
   */
  @Input()
  public set allowExtensions(value: boolean | undefined) {
    this.#_allowExtensions = value !== false;
  }

  public get allowExtensions(): boolean {
    return this.#_allowExtensions;
  }

  #_allowExtensions = true;

  /**
   * The
   * [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country code for the default country. The country selector button displays a flag
   * icon for this default country until users select a different country.
   * @default "us"
   */
  @Input()
  public set defaultCountry(value: string | undefined) {
    if (value !== this.#_defaultCountry) {
      value ??= DEFAULT_COUNTRY_CODE;
      this.#_defaultCountry = value.toLocaleLowerCase();
      this.#defaultCountryData = this.#getDefaultCountryData();
    }
  }

  public get defaultCountry(): string {
    return this.#_defaultCountry;
  }

  /**
   * The format for validated phone numbers.
   * Options include: `"default"`, `"international"`, and `"national"`.
   * @default "default"
   */
  @Input()
  public get returnFormat(): SkyPhoneFieldNumberReturnFormat {
    return this.#_returnFormat;
  }

  public set returnFormat(value: SkyPhoneFieldNumberReturnFormat | undefined) {
    this.#_returnFormat = value || 'default';
  }

  #_returnFormat: SkyPhoneFieldNumberReturnFormat = 'default';

  /**
   * The [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country codes for the countries that users can select. By default, all countries are available.
   */
  @Input()
  public supportedCountryISOs: string[] | undefined;

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

  public countrySearchForm: FormGroup<{
    countrySearch: FormControl<SkyCountryFieldCountry | undefined | null>;
  }>;

  /**
   * The currently selected country to validate against.
   */
  @Input()
  public set selectedCountry(newCountry: SkyPhoneFieldCountry | undefined) {
    if (
      newCountry &&
      (!this.#_selectedCountry ||
        this.#_selectedCountry.iso2 !== newCountry.iso2)
    ) {
      this.#_selectedCountry = this.countries.find(
        (country) => country.iso2 === newCountry.iso2,
      );

      if (this.#_selectedCountry && !this.#_selectedCountry.exampleNumber) {
        const numberObj = this.#phoneUtils.getExampleNumberForType(
          newCountry.iso2,
          PhoneNumberType.FIXED_LINE,
        );

        this.#_selectedCountry.exampleNumber = this.#phoneUtils.format(
          numberObj,
          PhoneNumberFormat.NATIONAL,
        );
      }

      this.#populateInputBoxHelpText();
      this.selectedCountryChange.emit(this.#_selectedCountry);
    }
  }

  public get selectedCountry(): SkyPhoneFieldCountry | undefined {
    return this.#_selectedCountry;
  }

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

  #defaultCountryData: SkyPhoneFieldCountry | undefined;

  #focusPhoneInputAfterAnimation = false;

  #phoneNumberFormatHintTextTemplateString = '';

  #phoneUtils = PhoneNumberUtil.getInstance();

  #longestDialCodeLength = 0;

  #_defaultCountry = DEFAULT_COUNTRY_CODE;

  #_selectedCountry: SkyPhoneFieldCountry | undefined;

  #countrySearchFormControl = new FormControl<
    SkyCountryFieldCountry | undefined | null
  >(undefined);

  #countryFlagFocusListenerFn: (() => void) | undefined;
  #dismissCountrySearchFocusListenerFn: (() => void) | undefined;

  #formBuilder: FormBuilder;
  #adapterService: SkyPhoneFieldAdapterService;
  readonly #appFormat = inject(SkyAppFormat);
  #changeDetector: ChangeDetectorRef;
  #ngUnsubscribe = new Subject<void>();
  readonly #resourceSvc = inject(SkyLibResourcesService);
  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #renderer = inject(Renderer2);

  constructor(
    formBuilder: FormBuilder,
    adapterService: SkyPhoneFieldAdapterService,
    changeDetector: ChangeDetectorRef,
    @Optional() public themeSvc?: SkyThemeService,
    @Optional() @SkipSelf() public inputBoxHostSvc?: SkyInputBoxHostService,
  ) {
    this.#formBuilder = formBuilder;
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;

    this.countries = cloneCountryData(intlTelInput.getCountryData());

    for (const country of this.countries) {
      country.dialCode = '+' + country.dialCode;

      if (country.dialCode.length > this.#longestDialCodeLength) {
        this.#longestDialCodeLength = country.dialCode.length;
      }
    }

    this.#defaultCountryData = this.#getDefaultCountryData();

    this.countrySearchForm = this.#formBuilder.group({
      countrySearch: this.#countrySearchFormControl,
    });

    this.#resourceSvc
      .getString('skyux_phone_field_format_hint_text')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((templateString) => {
        this.#phoneNumberFormatHintTextTemplateString = templateString;
        this.#populateInputBoxHelpText();
      });
  }

  public ngOnInit(): void {
    // The timeout here is needed to avoid a change before checked error when a user specifies
    // a selected country on initialization of the component.
    setTimeout(() => {
      if (this.inputBoxHostSvc && this.inputTemplateRef) {
        this.inputBoxHostSvc.populate({
          inputTemplate: this.inputTemplateRef,
          buttonsInsetTemplate: this.buttonsInsetTemplateRef,
          buttonsLeftTemplate: this.countryBtnTemplateRef,
        });
      }

      this.selectedCountry ??= this.#defaultCountryData;

      this.#changeDetector.markForCheck();
    }, 0);

    this.#countrySearchFormControl.valueChanges.subscribe(
      (newValue: SkyCountryFieldCountry | undefined | null) => {
        if (newValue?.iso2 !== this.selectedCountry?.iso2) {
          this.selectedCountry = newValue || undefined;
        }
      },
    );
  }

  public ngOnDestroy(): void {
    this.selectedCountryChange.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Sets the country to validate against based on the county's iso2 code.
   * @param newCountry The International Organization for Standardization's two-letter code
   * for the default country.
   * @internal
   */
  public onCountrySelected(newCountry: SkyCountryFieldCountry): void {
    if (newCountry) {
      this.selectedCountry = this.countries.find(
        (countryInfo) => countryInfo.iso2 === newCountry.iso2,
      );

      this.#focusPhoneInputAfterAnimation = true;
      this.toggleCountrySearch(false);
    }
  }

  public toggleCountrySearch(showSearch: boolean): void {
    if (showSearch) {
      this.phoneInputShown = false;
    } else {
      this.countrySearchShown = false;

      this.#countrySearchFormControl.setValue(undefined);
    }

    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputBoxHostSvc.setHintTextHidden(showSearch);
    }

    this.#changeDetector.markForCheck();
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

  public countrySearchAnimationEnd(e: AnimationEvent): void {
    if (!this.countrySearchShown) {
      this.phoneInputShown = true;
    } else {
      this.#adapterService.focusCountrySearchElement(e.element);

      let countryFlagButton: HTMLElement | undefined;
      let dismissCountrySearchButton: HTMLElement | undefined;

      // add event listeners for focusout from the buttons on either side of country search field.
      if (!this.inputBoxHostSvc) {
        countryFlagButton = this.#elementRef.nativeElement.querySelector(
          'button.sky-phone-field-country-select-btn',
        );
        dismissCountrySearchButton =
          this.#elementRef.nativeElement.querySelector(
            'button.sky-phone-field-search-btn-dismiss',
          );
      } else {
        countryFlagButton = this.inputBoxHostSvc.queryHost(
          'button.sky-phone-field-country-select-btn',
        );
        dismissCountrySearchButton = this.inputBoxHostSvc.queryHost(
          'button.sky-phone-field-search-btn-dismiss',
        );
      }

      if (countryFlagButton && dismissCountrySearchButton) {
        this.#countryFlagFocusListenerFn =
          this.addFocusEventListener(countryFlagButton);
        this.#dismissCountrySearchFocusListenerFn = this.addFocusEventListener(
          dismissCountrySearchButton,
        );
      }
    }

    this.#changeDetector.markForCheck();
  }

  public dismissButtonClicked(): void {
    this.#focusPhoneInputAfterAnimation = true;
    this.toggleCountrySearch(false);
  }

  public phoneInputAnimationEnd(e: AnimationEvent): void {
    if (!this.phoneInputShown) {
      this.countrySearchShown = true;
    } else {
      if (this.#focusPhoneInputAfterAnimation) {
        this.#adapterService.focusPhoneInput(e.element);
        this.#focusPhoneInputAfterAnimation = false;
      }

      // Remove focus out event listeners now that country search is closed.
      if (this.#countryFlagFocusListenerFn) {
        this.#countryFlagFocusListenerFn();
      }
      if (this.#dismissCountrySearchFocusListenerFn) {
        this.#dismissCountrySearchFocusListenerFn();
      }
    }

    this.#changeDetector.markForCheck();
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
        foundCountry = this.countries.find(
          (country) =>
            country.iso2.toLocaleUpperCase() === regionCode.toLocaleUpperCase(),
        );
      }
    } catch {
      foundCountry ??= this.#findCountryByDialCode(phoneNumberRaw);
    }

    if (foundCountry && !this.#validateSupportedCountry(foundCountry)) {
      foundCountry = undefined;
    }

    if (foundCountry !== this.selectedCountry) {
      this.selectedCountry = foundCountry;
      this.#changeDetector.markForCheck();
    }
  }

  #findCountryByDialCode(
    phoneNumberRaw: string,
  ): SkyPhoneFieldCountry | undefined {
    const defaultDialCode = this.#defaultCountryData?.dialCode;
    const selectedCountryDialCode = this.selectedCountry?.dialCode;

    let foundCountry: SkyPhoneFieldCountry | undefined;

    if (
      !selectedCountryDialCode ||
      !phoneNumberRaw.startsWith(selectedCountryDialCode)
    ) {
      for (let i = 1; i < this.#longestDialCodeLength + 1; i++) {
        const dialCode = phoneNumberRaw.substring(0, i);

        if (defaultDialCode === dialCode) {
          foundCountry = this.#defaultCountryData;
        } else if (selectedCountryDialCode !== dialCode) {
          const dialCodeCountries = this.countries.filter(
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

  #getDefaultCountryData(): SkyPhoneFieldCountry | undefined {
    return this.countries.find(
      (country) => country.iso2 === this.#_defaultCountry,
    );
  }

  #populateInputBoxHelpText(): void {
    if (this.inputBoxHostSvc && this.inputTemplateRef) {
      this.inputBoxHostSvc?.setHintText(
        this.#appFormat.formatText(
          this.#phoneNumberFormatHintTextTemplateString,
          this.#_selectedCountry?.exampleNumber,
        ),
      );
    }
  }

  #validateSupportedCountry(country: SkyPhoneFieldCountry): boolean {
    return (
      !this.supportedCountryISOs ||
      this.supportedCountryISOs.findIndex(
        (isoCode) => isoCode.toUpperCase() === country.iso2.toUpperCase(),
      ) >= 0
    );
  }
}
