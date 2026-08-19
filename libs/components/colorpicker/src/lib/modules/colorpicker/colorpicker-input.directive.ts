import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { SkyRequiredStateDirective } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject, Subscription, distinctUntilChanged, takeUntil } from 'rxjs';

import { SkyColorpickerInputService } from './colorpicker-input.service';
import { SkyColorpickerComponent } from './colorpicker.component';
import { SkyColorpickerService } from './colorpicker.service';
import { SkyColorpickerOutput } from './types/colorpicker-output';

const SKY_COLORPICKER_DEFAULT_COLOR = '#FFFFFF';

/**
 * Creates the colorpicker element and dropdown.
 *
 * Implements `FormValueControl` (from `@angular/forms/signals`) instead of
 * `ControlValueAccessor`. Angular's signal-forms interop lets a
 * `FormValueControl` work with signal, reactive, and template-driven forms
 * without any CVA-specific code, so this directive no longer needs a
 * `NG_VALUE_ACCESSOR` provider.
 *
 * The host element is a native `<input>`, so Angular's built-in
 * `DefaultValueAccessor` still matches a `formControlName`/`formControl`/
 * `ngModel` binding there. The `ngNoCva` host attribute tells
 * `@angular/forms` to ignore that built-in accessor at runtime and use this
 * directive's custom-control (`value`/`valueChange`) interop instead, for
 * every form flavor.
 */
@Directive({
  selector: '[skyColorpickerInput]',
  hostDirectives: [
    {
      directive: SkyRequiredStateDirective,
      inputs: ['required'],
    },
  ],
  host: {
    class: 'sky-colorpicker-input',
    readonly: 'true',
    ngNoCva: '',
    '(input)': 'changeInput()',
    '(change)': 'onChange()',
    '(blur)': 'touch.emit()',
  },
})
export class SkyColorpickerInputDirective
  implements FormValueControl<string | undefined>, OnInit, OnChanges, OnDestroy
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
      this.#applyIncomingValue(value);
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

  /**
   * Implemented as part of `FormValueControl`. Holds the color in the format
   * `outputFormat` specifies (`rgba` by default). Kept in sync with the bound
   * `[formField]`, `formControl`/`formControlName`, or `ngModel`.
   */
  public readonly value = model<string | undefined>(undefined);

  /**
   * Implemented as part of `FormUiControl`. Reflects the bound field's
   * disabled state onto the colorpicker dialog. Replaces the
   * `ControlValueAccessor.setDisabledState` callback, which only reactive and
   * template-driven forms called.
   */
  public readonly disabled = input(false);

  /**
   * Implemented as part of `FormUiControl`. Emitted on native `blur`, and
   * relayed from `SkyColorpickerComponent` when the user opens the picker
   * dialog via the trigger button. `Field`/`NgControl` listen to this output
   * to mark the bound field as touched, for every form flavor.
   */
  public readonly touch = output<void>();

  #modelValue: SkyColorpickerOutput | undefined;
  #lastEmittedValue: string | undefined;
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #svc = inject(SkyColorpickerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  #inputIdSubscription: Subscription | undefined;
  #labelText: string | undefined;

  #_initialColor: string | undefined;

  readonly #colorpickerInputSvc = inject(SkyColorpickerInputService);
  readonly #ngUnsubscribe = new Subject<void>();

  constructor() {
    // Reflects the bound field's value onto the colorpicker whenever it
    // changes from outside this directive (for example, a schema rule, a
    // `reset()`, or a sibling control). Writes this directive makes itself
    // are tracked in `#lastEmittedValue` so this effect doesn't immediately
    // reformat its own output.
    effect(() => {
      const incoming = this.value();

      if (incoming !== this.#lastEmittedValue) {
        this.#applyIncomingValue(incoming);
      }
    });

    effect(() => {
      const isDisabled = this.disabled();

      this.skyColorpickerInput.disabled = isDisabled;

      if (isDisabled) {
        this.skyColorpickerInput.backgroundColorForDisplay = '#fff';
      } else if (this.#modelValue) {
        this.skyColorpickerInput.backgroundColorForDisplay =
          this.#modelValue.hex;
      }
    });
  }

  public changeInput(): void {
    const value = this.#elementRef.nativeElement.value;
    this.skyColorpickerInput.updatePickerValues(value);
    this.skyColorpickerInput.backgroundColorForDisplay = value;
  }

  public onChange(): void {
    const newValue = this.#elementRef.nativeElement.value;
    this.#applyColor(this.#formatter(newValue));
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
          this.#applyColor(this.#formatter(newColor));
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

    this.#colorpickerInputSvc.ariaError
      .pipe(
        distinctUntilChanged((a, b) => {
          return a.hasError === b.hasError && a.errorId === b.errorId;
        }),
        takeUntil(this.#ngUnsubscribe),
      )
      .subscribe((errorState) => {
        if (errorState.hasError) {
          this.#renderer.setAttribute(element, 'aria-invalid', 'true');
          this.#renderer.setAttribute(
            element,
            'aria-errormessage',
            errorState.errorId,
          );
        } else {
          this.#renderer.removeAttribute(element, 'aria-invalid');
          this.#renderer.removeAttribute(element, 'aria-errormessage');
        }
      });

    this.#colorpickerInputSvc.touch
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => this.touch.emit());

    this.skyColorpickerInput.updatePickerValues(this.initialColor);

    /* Sanity check */
    /* istanbul ignore else */
    if (!this.disabled()) {
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

  /**
   * Applies a value that originated outside this directive (the bound
   * field's initial value, a schema-driven reset, `initialColor`, etc.).
   * Unlike `#applyColor`, this does not write back to `value`, since the
   * value already came from there (or from a deprecated input that only
   * seeds the field before it has a value).
   */
  #applyIncomingValue(value: string | undefined): void {
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
    }
  }

  /**
   * Applies a color the user selected (through the native input or the
   * picker dialog) and propagates it to `value`, so it reaches whatever form
   * this directive is bound to.
   */
  #applyColor(formattedValue: SkyColorpickerOutput): void {
    this.#modelValue = formattedValue;
    this.#writeModelValue(formattedValue);

    const output = this.#toOutputString(formattedValue);
    this.#lastEmittedValue = output;
    this.value.set(output);
  }

  #writeModelValue(model: SkyColorpickerOutput): void {
    const setElementValue = model.rgbaText;
    const element = this.#elementRef.nativeElement;
    const output = this.#toOutputString(model);

    this.skyColorpickerInput.updatePickerValues(output);
    this.skyColorpickerInput.backgroundColorForDisplay = output;

    this.#renderer.setStyle(element, 'background-color', setElementValue);
    this.#renderer.setProperty(element, 'value', output);
  }

  #toOutputString(model: SkyColorpickerOutput): string {
    switch (this.outputFormat) {
      case 'hsla':
        return model.hslaText;
      case 'cmyk':
        return model.cmykText;
      case 'hex':
        return model.hex;
      default:
        return model.rgbaText;
    }
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
