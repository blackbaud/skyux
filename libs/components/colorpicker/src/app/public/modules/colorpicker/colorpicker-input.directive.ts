import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  NgControl,
  FormControl
} from '@angular/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  Subscription
} from 'rxjs';

import {
  SkyColorpickerService
} from './colorpicker.service';

import {
  SkyColorpickerComponent
} from './colorpicker.component';

import {
  SkyColorpickerHsva
} from './types/colorpicker-hsva';

import {
  SkyColorpickerOutput
} from './types/colorpicker-output';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_COLORPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true
};

const SKY_COLORPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true
};
// tslint:enable
const SKY_COLORPICKER_DEFAULT_COLOR = '#FFFFFF';

  /**
   * Creates the colorpicker element and dropdown.
   */
  @Directive({
  selector: '[skyColorpickerInput]',
  providers: [
    SKY_COLORPICKER_VALUE_ACCESSOR,
    SKY_COLORPICKER_VALIDATOR
  ]
})
export class SkyColorpickerInputDirective
  implements OnInit, OnChanges, ControlValueAccessor, Validator, OnDestroy {

  public pickerChangedSubscription: Subscription;

  /**
   * Creates the colorpicker element and dropdown. Place this attribute on an `input` element
   * or `button` element, wrap the element in a `sky-colorpicker` component, and set the attribute
   * to the instance of the `sky-colorpicker` component.
   * @required
   */
  @Input()
  public skyColorpickerInput: SkyColorpickerComponent;

  /**
   * Specifies an initial color to load in the colorpicker. Use a reactive or
   * template-driven form to set this value. This property is deprecated. As an alternative,
   * we recommend the `formControlName` property on reactive forms or `ngModel` on
   * template-driven forms. See the demo for examples.
   * @deprecated
   */
  @Input()
  public set initialColor(value: string) {
    if (!this._initialColor && !this.modelValue) {
      this.writeValue(value);
    }
    this._initialColor = value;
  }

  public get initialColor(): string {
    return this._initialColor || SKY_COLORPICKER_DEFAULT_COLOR;
  }

  /**
   * This property is deprecated and does not affect the colorpicker.
   * We recommend against using it.
   * @deprecated
   */
  @Input()
  public returnFormat = 'rgba';

  /**
   * Specifies the format to use for the color when the colorpicker uses a native input
   * element such as a standard text input or a button. This property accepts `rgba`, `hex`,
   * or `hsla`, but we do not recommend using it because users never see or use its value.
   * Instead, if you need to access this format value, see the demo for an example.
   */
  @Input()
  public outputFormat = 'rgba';

  /**
   * Specifies an array of colors to load as preset choices. The colorpicker displays the
   * colors in a series of 12 boxes for users to select.
   */
  @Input()
  public presetColors = ['#333', '#888', '#EFEFEF', '#FFF'];

  /**
   * Specifies the type of transparency to use in the transparency slider.
   */
  @Input()
  public alphaChannel = 'hex6';

  /**
   * Indicates whether to display a transparency slider for users to select transparency
   * levels.
   */
  @Input()
  public allowTransparency = true;

  private _disabled: boolean;
  private _initialColor: string;
  private modelValue: SkyColorpickerOutput;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private service: SkyColorpickerService,
    private resourcesService: SkyLibResourcesService,
    private injector: Injector
  ) { }

  @HostListener('input', ['$event'])
  public changeInput(event: any) {
    const value = event.target.value;
    this.skyColorpickerInput.updatePickerValues(value);
    this.skyColorpickerInput.backgroundColorForDisplay = value;
  }

  @HostListener('change', ['$event'])
  public onChange(event: any) {
    const newValue = event.target.value;
    this.modelValue = this.formatter(newValue);
    this._validatorChange();
    this._onChange(this.modelValue);
    this.writeModelValue(this.modelValue);
  }

  /* istanbul ignore next */
  @HostListener('blur')
  public onBlur() {
    /*istanbul ignore next */
    this._onTouched();
  }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    this.renderer.addClass(element, 'sky-form-control');
    this.skyColorpickerInput.initialColor = this.initialColor;
    this.skyColorpickerInput.returnFormat = this.returnFormat;

    this.pickerChangedSubscription =
      this.skyColorpickerInput.selectedColorChanged.subscribe((newColor: SkyColorpickerOutput) => {
        if (newColor) {
          this.modelValue = this.formatter(newColor);
          this.writeModelValue(this.modelValue);
        }
        this._onChange(newColor);
      });

    this.skyColorpickerInput.updatePickerValues(this.initialColor);

    if (!this._disabled) {
      this.skyColorpickerInput.backgroundColorForDisplay = this.initialColor;
    }

    /// Set aria-label as default, if not set
    if (!element.getAttribute('aria-label')) {
      this.renderer.setAttribute(
        element,
        'aria-label',
        this.getString('skyux_colorpicker_input_default_label'));
    }

    const typeAttr = element.getAttribute('type');
    if (typeAttr && typeAttr === 'hidden') {
      this.skyColorpickerInput.isVisible = false;
    } else {
      this.skyColorpickerInput.isVisible = true;
    }

    element.setAttribute('readonly', 'true');
    this.renderer.addClass(element, 'sky-colorpicker-input');
  }

  public ngOnDestroy() {
    this.pickerChangedSubscription.unsubscribe();
  }

  public setColorPickerDefaults() {
    this.skyColorpickerInput.setDialog(
      this,
      this.elementRef,
      this.initialColor,
      this.outputFormat,
      this.presetColors,
      this.alphaChannel,
      this.allowTransparency
    );
  }

  public ngOnChanges(): void {
    this._validatorChange();
    this.skyColorpickerInput.returnFormat = this.returnFormat;
    this.setColorPickerDefaults();
  }

  public registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
  public registerOnTouched(fn: () => any): void { this._onTouched = fn; }
  public registerOnValidatorChange(fn: () => void): void { this._validatorChange = fn; }

  public writeValue(value: any) {
    if (this.skyColorpickerInput && value && value !== this.skyColorpickerInput.lastAppliedColor) {
      this.modelValue = this.formatter(value);
      this.writeModelValue(this.modelValue);

      if (!this._initialColor) {
        this._initialColor = value;
        this.skyColorpickerInput.initialColor = value;
      }
      this.skyColorpickerInput.lastAppliedColor = value;
      let control: FormControl = (this.injector.get<NgControl>(NgControl)).control as FormControl;
      if (control) {
        control.setValue(this.modelValue, { emitEvent: false });
      }
    }
  }

  public validate(control: AbstractControl): { [key: string]: any } {
    let value = control.value;
    if (!value) {
      return;
    }
    // Validation
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
   public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.skyColorpickerInput.disabled = isDisabled;
    if (this._disabled) {
      this.skyColorpickerInput.backgroundColorForDisplay = '#fff';
    } else {
      this.skyColorpickerInput.backgroundColorForDisplay = this.modelValue.hex;
    }
  }

  private writeModelValue(model: SkyColorpickerOutput) {
    const setElementValue = model.rgbaText;
    const element = this.elementRef.nativeElement;

    let output: string;
    // tslint:disable-next-line:switch-default
    switch (this.outputFormat) {
      case 'rgba':
        output = model.rgbaText;
        break;

      case 'hsla':
        output = model.hslaText;
        break;

      case 'cmyk':
        output = model.cmykText;
        break;

      case 'hex':
        output = model.hex;
        break;
    }

    this.skyColorpickerInput.updatePickerValues(output);
    this.skyColorpickerInput.backgroundColorForDisplay = output;

    this.renderer.setStyle(element, 'background-color', setElementValue);
    this.renderer.setProperty(element, 'value', output);
  }

  private formatter(color: any) {
    if (color && typeof color !== 'string') {
      return color;
    }

    let formatColor: SkyColorpickerOutput;
    let hsva: SkyColorpickerHsva = this.service.stringToHsva(color, this.alphaChannel === 'hex8');

    formatColor = this.service.skyColorpickerOut(hsva);

    return formatColor;
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key
    );
  }

  /*istanbul ignore next */
  private _onChange = (_: any) => { };
  /*istanbul ignore next */
  private _onTouched = () => { };
  private _validatorChange = () => { };

}
