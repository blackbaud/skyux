import {
  animate,
  AnimationEvent,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyInputBoxHostService
} from '@skyux/forms';

import {
  SkyCountryFieldCountry
} from '@skyux/lookup';

import {
  SkyThemeService
} from '@skyux/theme';

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
    SkyPhoneFieldAdapterService,
    // Prevents the embedded country field component from changing its behavior based on
    // being inside an input box. The phone field itself will handle the required changes
    // for input box.
    {
      provide: SkyInputBoxHostService,
      useValue: undefined
    }
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
   * Indicates whether or not phone number extensions are allowed.
   * @default true
   */
  @Input()
  public allowExtensions: boolean = true;

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
   * Specifies the [International Organization for Standardization Alpha 2](https://www.nationsonline.org/oneworld/country_code_list.htm)
   * country codes for the countries that users can select. By default, all countries are available.
   */
  @Input()
  public supportedCountryISOs: string[];

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

  @ViewChild('inputTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private inputTemplateRef: TemplateRef<any>;

  @ViewChild('countryBtnTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private countryBtnTemplateRef: TemplateRef<any>;

  @ViewChild('buttonsInsetTemplateRef', {
    read: TemplateRef,
    static: true
  })
  private buttonsInsetTemplateRef: TemplateRef<any>;

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
    @Optional() public themeSvc?: SkyThemeService,
    @Optional() @SkipSelf() public inputBoxHostSvc?: SkyInputBoxHostService
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
      if (this.inputBoxHostSvc) {
        this.inputBoxHostSvc.populate(
          {
            inputTemplate: this.inputTemplateRef,
            buttonsInsetTemplate: this.buttonsInsetTemplateRef,
            buttonsLeftTemplate: this.countryBtnTemplateRef
          }
        );
      }

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

  public countrySearchAnimationEnd(e: AnimationEvent) {
    if (!this.countrySearchShown) {
      this.phoneInputShown = true;
    } else {
      this.adapterService.focusCountrySearchElement(e.element);
    }

    this.changeDetector.markForCheck();
  }

  public phoneInputAnimationEnd(e: AnimationEvent) {
    if (!this.phoneInputShown) {
      this.countrySearchShown = true;
    } else {
      if (this.phoneInputAnimationTriggered) {
        this.adapterService.focusPhoneInput(e.element);
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
