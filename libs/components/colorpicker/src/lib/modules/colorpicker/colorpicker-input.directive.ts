import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  forwardRef,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject, Subscription, takeUntil } from 'rxjs';

import { SkyColorpickerInputService } from './colorpicker-input.service';
import { SkyColorpickerComponent } from './colorpicker.component';
import { SkyColorpickerService } from './colorpicker.service';
import { SkyColorpickerOutput } from './types/colorpicker-output';

const SKY_COLORPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true,
};

const SKY_COLORPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyColorpickerInputDirective),
  multi: true,
};

const SKY_COLORPICKER_DEFAULT_COLOR = '#FFFFFF';

/**
 * Creates the colorpicker element and dropdown.
 */
@Directive({
  selector: '[skyColorpickerInput]',
  providers: [SKY_COLORPICKER_VALUE_ACCESSOR, SKY_COLORPICKER_VALIDATOR],
})
export class SkyColorpickerInputDirective
  implements OnInit, OnChanges, ControlValueAccessor, Validator, OnDestroy
{
  /**
   * Creates the colorpicker element and dropdown. Place this attribute on an `input` element
   * or `button` element, wrap the element in a `sky-colorpicker` component, and set the attribute
   * to the instance of the `sky-colorpicker` component.
   * @required
   */
  @Input()
  public skyColorpickerInput!: SkyColorpickerComponent;

  /**
   * The initial color to load in the colorpicker. Use a reactive or
   * template-driven form to set this value. This property is deprecated. As an alternative,
   * we recommend the `formControlName` property on reactive forms or `ngModel` on
   * template-driven forms. See the demo for examples.
   * @deprecated
   */
  @Input()
  public set initialColor(value: string | undefined) {
    /* istanbul ignore else */
    if (!this.#_initialColor && !this.#modelValue) {
      this.writeValue(value);
    }

    this.#_initialColor = value;
  }

  public get initialColor(): string {
    return this.#_initialColor || SKY_COLORPICKER_DEFAULT_COLOR;
  }

  /**
   * The ID should only be settable when `labelText` is undefined.
   * When `labelText` is set, the ID is defined by `SkyColorpickerComponent`.
   * @internal
   */
  @Input()
  public set id(value: string | undefined) {
    if (!this.#labelText && value) {
      this.#setInputId(value);
    }
  }

  /**
   * This property is deprecated and does not affect the colorpicker.
   * We recommend against using it.
   * @deprecated
   * @default "rgba"
   */
  @Input()
  public returnFormat = 'rgba';

  /**
   * The format for the color when the colorpicker uses a native input
   * element such as a standard text input or a button. This property accepts `rgba`, `hex`,
   * or `hsla`, but we do not recommend using it because users never see or use its value.
   * Instead, if you need to access this format value, see the demo for an example.
   * @default "rgba"
   */
  @Input()
  public outputFormat = 'rgba';

  /**
   * The array of colors to load as preset choices. The colorpicker displays the
   * colors in a series of 12 boxes for users to select.
   */
  @Input()
  public presetColors = ['#333', '#888', '#EFEFEF', '#FFF'];

  /**
   * The type of transparency in the transparency slider.
   *@default "hex6"
   */
  @Input()
  public alphaChannel = 'hex6';

  /**
   * Whether to display a transparency slider for users to select transparency
   * levels.
   */
  @Input()
  public allowTransparency = true;

  @HostBinding('readonly')
  protected get readonly(): boolean {
    return true;
  }

  @HostBinding('class.sky-colorpicker-input')
  protected get colorInputClass(): boolean {
    return true;
  }

  #modelValue: SkyColorpickerOutput | undefined;
  #elementRef: ElementRef;
  #renderer: Renderer2;
  #svc: SkyColorpickerService;
  #resourcesSvc: SkyLibResourcesService;
  #injector: Injector;
  #inputIdSubscription: Subscription | undefined;
  #labelText: string | undefined;

  #_disabled: boolean | undefined;
  #_initialColor: string | undefined;

  readonly #colorpickerInputSvc = inject(SkyColorpickerInputService);
  readonly #ngUnsubscribe = new Subject<void>();

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    svc: SkyColorpickerService,
    resourcesSvc: SkyLibResourcesService,
    injector: Injector,
  ) {
    this.#elementRef = elementRef;
    this.#renderer = renderer;
    this.#svc = svc;
    this.#resourcesSvc = resourcesSvc;
    this.#injector = injector;
  }

  @HostListener('input')
  public changeInput(): void {
    const value = this.#elementRef.nativeElement.value;
    this.skyColorpickerInput.updatePickerValues(value);
    this.skyColorpickerInput.backgroundColorForDisplay = value;
  }

  @HostListener('change')
  public onChange(): void {
    const newValue = this.#elementRef.nativeElement.value;
    const formattedValue = this.#formatter(newValue);
    this.#modelValue = formattedValue;
    this.#writeModelValue(formattedValue);
  }

  public ngOnInit(): void {
    const element = this.#elementRef.nativeElement;

    this.#renderer.addClass(element, 'sky-form-control');
    this.skyColorpickerInput.initialColor = this.initialColor;
    this.skyColorpickerInput.returnFormat = this.returnFormat;

    this.skyColorpickerInput.selectedColorChanged
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((newColor: SkyColorpickerOutput) => {
        /* istanbul ignore else */
        if (newColor) {
          this.#modelValue = this.#formatter(newColor);

          // Write the new value to the reactive form control, which will update the template model
          this.writeValue(newColor);
        }
      });

    this.#colorpickerInputSvc.labelText
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((labelText) => {
        this.#labelText = labelText;
        this.#inputIdSubscription?.unsubscribe();

        if (labelText) {
          this.#inputIdSubscription = this.#colorpickerInputSvc.inputId
            .pipe(takeUntil(this.#ngUnsubscribe))
            .subscribe((inputId) => {
              this.#setInputId(inputId);
            });
        }
      });

    this.skyColorpickerInput.updatePickerValues(this.initialColor);

    /* Sanity check */
    /* istanbul ignore else */
    if (!this.#_disabled) {
      this.skyColorpickerInput.backgroundColorForDisplay = this.initialColor;
    }

    /// Set aria-label as default, if not set
    if (!element.getAttribute('aria-label')) {
      this.#renderer.setAttribute(
        element,
        'aria-label',
        this.#getString('skyux_colorpicker_input_default_label'),
      );
    }

    const typeAttr = element.getAttribute('type');
    if (typeAttr && typeAttr === 'hidden') {
      this.skyColorpickerInput.isVisible = false;
    } else {
      this.skyColorpickerInput.isVisible = true;
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public setColorPickerDefaults(): void {
    this.skyColorpickerInput.setDialog(
      this.initialColor,
      this.outputFormat,
      this.presetColors,
      this.alphaChannel,
      this.allowTransparency,
    );
  }

  public ngOnChanges(): void {
    this.skyColorpickerInput.returnFormat = this.returnFormat;
    this.setColorPickerDefaults();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public registerOnChange(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public registerOnTouched(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public registerOnValidatorChange(): void {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public writeValue(value: any): void {
    if (
      this.skyColorpickerInput &&
      value &&
      value !== this.skyColorpickerInput.lastAppliedColor
    ) {
      const formattedValue = this.#formatter(value);

      this.#modelValue = formattedValue;
      this.#writeModelValue(formattedValue);

      if (!this.#_initialColor) {
        this.#_initialColor = value;
        this.skyColorpickerInput.initialColor = value;
      }
      this.skyColorpickerInput.lastAppliedColor = value;

      const control = this.#injector.get<NgControl>(NgControl, undefined, {
        optional: true,
      })?.control;

      if (control) {
        control.setValue(this.#modelValue, { emitEvent: false });
      }
    }
  }

  public validate(): ValidationErrors | null {
    return null;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.#_disabled = isDisabled;
    this.skyColorpickerInput.disabled = isDisabled;
    if (this.#_disabled) {
      this.skyColorpickerInput.backgroundColorForDisplay = '#fff';
    } else if (this.#modelValue) {
      this.skyColorpickerInput.backgroundColorForDisplay = this.#modelValue.hex;
    }
  }

  #writeModelValue(model: SkyColorpickerOutput): void {
    const setElementValue = model.rgbaText;
    const element = this.#elementRef.nativeElement;

    let output: string;
    switch (this.outputFormat) {
      case 'hsla':
        output = model.hslaText;
        break;
      case 'cmyk':
        output = model.cmykText;
        break;
      case 'hex':
        output = model.hex;
        break;
      default:
        output = model.rgbaText;
        break;
    }

    this.skyColorpickerInput.updatePickerValues(output);
    this.skyColorpickerInput.backgroundColorForDisplay = output;

    this.#renderer.setStyle(element, 'background-color', setElementValue);
    this.#renderer.setProperty(element, 'value', output);
  }

  #formatter(
    color: string | SkyColorpickerOutput | undefined,
  ): SkyColorpickerOutput {
    if (color && typeof color !== 'string') {
      return color;
    }

    const hsva = this.#svc.stringToHsva(
      color as string,
      this.alphaChannel === 'hex8',
    );

    // TODO: This code assumed non-null pre-strict mode. Reevaluate in the future?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const formatColor = this.#svc.skyColorpickerOut(hsva!);

    return formatColor;
  }

  #getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesSvc.getStringForLocale({ locale: 'en-US' }, key);
  }

  #setInputId(id: string): void {
    this.#renderer.setAttribute(this.#elementRef.nativeElement, 'id', id);
  }
}
