import {
  Directive,
  ElementRef,
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
import { SkyRequiredStateDirective, skyIsAbstractControl } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject, Subscription, distinctUntilChanged, takeUntil } from 'rxjs';

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

// Implements `ControlValueAccessor` only (classic reactive/template-driven
// forms). Angular prefers a directive's own `NG_VALUE_ACCESSOR` over the
// native `DefaultValueAccessor` that would otherwise match this host
// `<input>`, so `formControlName`/`formControl`/`ngModel` keep working
// through the CVA methods below. `@angular/forms/signals`' `Field` directive
// also checks for a `ControlValueAccessor` first and, when present, bridges
// it to the field automatically — so sync for every form flavor (including
// `disabled`, via `setDisabledState`) happens through the CVA methods below,
// with no need for a separate `FormValueControl` implementation.
/**
 * Creates the colorpicker element and dropdown.
 */
@Directive({
  selector: '[skyColorpickerInput]',
  providers: [SKY_COLORPICKER_VALUE_ACCESSOR, SKY_COLORPICKER_VALIDATOR],
  hostDirectives: [
    {
      directive: SkyRequiredStateDirective,
      inputs: ['required'],
    },
  ],
  host: {
    class: 'sky-colorpicker-input',
    readonly: 'true',
    '(input)': 'changeInput()',
    '(change)': 'onChange()',
    '(blur)': 'onBlur()',
  },
})
export class SkyColorpickerInputDirective
  implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy
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

  #modelValue: SkyColorpickerOutput | undefined;
  // The normalized output string (per `outputFormat`) most recently rendered
  // into the native input element and colorpicker dialog, regardless of
  // whether it came from a user action (`#applyColor`) or from outside this
  // directive (`#applyIncomingValue`). This is the single source of truth
  // for whether an incoming value is actually a change, replacing the two
  // separate (and easily desynced) trackers this directive used to keep:
  // a self-emitted-value guard and `SkyColorpickerComponent.lastAppliedColor`.
  #renderedValue: string | undefined;
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  readonly #svc = inject(SkyColorpickerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  #inputIdSubscription: Subscription | undefined;
  #labelText: string | undefined;

  #_initialColor: string | undefined;

  // Resolved lazily (not injected in the constructor) because this
  // directive also provides `NG_VALUE_ACCESSOR` for itself: eagerly
  // injecting `NgControl` here would create a circular dependency for
  // `[formField]` (signal forms) bindings, whose `NgControl` compatibility
  // shim itself depends on resolving this directive's value accessor
  // first. `[formField]` bindings do provide an `NgControl` (a read-only
  // interop shim, `InteropNgControl`, with no `setValue`), so
  // `skyIsAbstractControl` guards every use of `#ngControl.control` below.
  // The `AbstractControl` normalization this getter enables only actually
  // applies to reactive/template-driven form bindings (`formControlName`,
  // `[formControl]`, `[ngModel]`): normalizing a bound `AbstractControl`'s
  // value into the full `SkyColorpickerOutput` object those pre-existing
  // consumers already depend on (`control.value.hex`,
  // `control.value.rgba.alpha`, etc.), matching this directive's previous
  // `ControlValueAccessor`-based contract. Written to directly (bypassing
  // `onChange`), since calling `onChange` under signal forms always marks
  // the field dirty, even for values that didn't originate from the user.
  readonly #injector = inject(Injector);
  get #ngControl(): NgControl | null {
    return this.#injector.get(NgControl, null, { optional: true, self: true });
  }

  readonly #colorpickerInputSvc = inject(SkyColorpickerInputService);
  readonly #ngUnsubscribe = new Subject<void>();

  // Populated by `registerOnChange`/`registerOnTouched` for
  // `formControlName`/`[formControl]`/`[ngModel]` consumers. `@angular/forms/
  // signals`' `FormField` directive registers these too when it detects this
  // `ControlValueAccessor`, so they cover every form flavor.
  #onChange: ((value: SkyColorpickerOutput) => void) | undefined;
  #onTouched: (() => void) | undefined;

  public changeInput(): void {
    const value = this.#elementRef.nativeElement.value;
    this.skyColorpickerInput.updatePickerValues(value);
    this.skyColorpickerInput.backgroundColorForDisplay = value;
  }

  public onChange(): void {
    const newValue = this.#elementRef.nativeElement.value;
    this.#applyColor(this.#formatter(newValue));
  }

  public onBlur(): void {
    this.#markTouched();
  }

  /**
   * Implemented as part of `ControlValueAccessor`.
   */
  public writeValue(value: SkyColorpickerOutput | string | undefined): void {
    this.#applyIncomingValue(value);
  }

  /**
   * Implemented as part of `ControlValueAccessor`.
   */
  public registerOnChange(fn: (value: SkyColorpickerOutput) => void): void {
    this.#onChange = fn;
  }

  /**
   * Implemented as part of `ControlValueAccessor`.
   */
  public registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  /**
   * Implemented as part of `ControlValueAccessor`.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.skyColorpickerInput.disabled = isDisabled;
  }

  /**
   * Implemented as part of `Validator`. This directive contributes no
   * validation of its own — `required` is handled by the `SkyRequiredStateDirective`
   * host directive instead.
   */
  public validate(): ValidationErrors | null {
    return null;
  }

  #markTouched(): void {
    this.#onTouched?.();
  }

  public ngOnInit(): void {
    const element = this.#elementRef.nativeElement;

    this.#renderer.addClass(element, 'sky-form-control');
    this.skyColorpickerInput.initialColor = this.initialColor;
    this.skyColorpickerInput.returnFormat = this.returnFormat;

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
      .subscribe(() => this.#markTouched());

    // A color the user applied through the picker dialog's Apply button.
    // This is a user-driven change, so it's written through to the bound
    // field via `#applyColor` (which calls `onChange` and marks the field
    // dirty).
    this.#colorpickerInputSvc.colorApplied
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((newColor) => {
        /* istanbul ignore else */
        if (newColor) {
          this.#applyColor(this.#formatter(newColor));
        }
      });

    // A programmatic reset (the `SkyColorpickerMessageType.Reset` message,
    // sent either by a consumer or by the picker's own reset button).
    // Reset always reverts to `initialColor`, the field's pristine value,
    // so it's applied through `#applyIncomingValue` rather than
    // `#applyColor`, which would otherwise mark the field dirty.
    this.#colorpickerInputSvc.reset
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((value) => {
        this.#applyIncomingValue(value);
      });

    this.skyColorpickerInput.updatePickerValues(this.initialColor);
    this.skyColorpickerInput.backgroundColorForDisplay = this.initialColor;

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

  // Applies a value that originated outside this directive (the bound
  // field's initial value, a schema-driven reset, `initialColor`, a
  // programmatic `SkyColorpickerMessageType.Reset` message, etc.). Unlike
  // `#applyColor`, this does not call `onChange`, since under signal forms
  // that always marks the field dirty — which an externally-driven value
  // shouldn't do. For reactive/template-driven forms only, a string value
  // is still normalized into the full `SkyColorpickerOutput` object by
  // writing directly to the bound `NgControl`'s `AbstractControl` instead;
  // a signal-forms field bound to a string keeps that raw string until the
  // user selects a color, at which point `#applyColor` writes the full
  // object back through `onChange`.
  //
  // Compares the normalized value against `#renderedValue` (the last value
  // actually rendered, from any source) rather than a separate
  // self-emitted-value tracker, so this can't loop on the directive's own
  // writes but still re-renders any value that isn't already showing.
  #applyIncomingValue(value: SkyColorpickerOutput | string | undefined): void {
    if (!this.skyColorpickerInput) {
      return;
    }

    if (!value) {
      this.#clearRenderedValue();
      return;
    }

    if (typeof value === 'string') {
      if (value === this.#renderedValue) {
        // Already showing exactly this string, most commonly this
        // directive's own prior write (`#applyColor`) echoing back through
        // `value`. Skip before formatting: re-parsing isn't needed, and
        // could fail for a value the current `alphaChannel`/`outputFormat`
        // settings can no longer parse (for example, a 6-digit hex string
        // once `alphaChannel` is `hex8`, which only accepts 8 digits).
        return;
      }
    } else if (value === this.#modelValue) {
      // Already showing exactly this `SkyColorpickerOutput` object, most
      // commonly this directive's own prior write (`#applyColor`) echoing
      // back through `value`.
      return;
    }

    const formattedValue = this.#formatter(value);
    const output = this.#toOutputString(formattedValue);

    if (output === this.#renderedValue) {
      return;
    }

    this.#renderedValue = output;
    this.#modelValue = formattedValue;
    this.#writeModelValue(formattedValue);

    // For reactive/template-driven forms, normalize the bound control's
    // value to the full `SkyColorpickerOutput` object, restoring this
    // directive's pre-signal-forms contract for those consumers. Written
    // directly to the control (not through `onChange`) so it doesn't mark
    // the field dirty; the control's own change detection then reflects the
    // normalized object back for us. `[formField]` (signal forms) bindings
    // also expose an `NgControl` (for interop with APIs that expect one),
    // but it's a read-only compatibility shim with no `setValue`, so this
    // only ever applies to real reactive/template-driven form controls.
    const control = this.#ngControl?.control;
    if (skyIsAbstractControl(control) && control.value !== formattedValue) {
      control.setValue(formattedValue, { emitEvent: false });
    }

    // The initial-color bookkeeping only deals in color strings, so a
    // `SkyColorpickerOutput` incoming value uses its normalized output
    // string here instead of the raw object.
    const initialColorValue = typeof value === 'string' ? value : output;

    if (!this.#_initialColor) {
      this.#_initialColor = initialColorValue;
      this.skyColorpickerInput.initialColor = initialColorValue;
    }
    this.skyColorpickerInput.lastAppliedColor = initialColorValue;
  }

  // Applies a color the user selected (through the native input or the
  // picker dialog) and propagates it, via the registered `onChange`
  // callback, to whatever form this directive is bound to (reactive,
  // template-driven, or signal forms, all of which register `onChange`
  // through this CVA).
  #applyColor(formattedValue: SkyColorpickerOutput): void {
    const output = this.#toOutputString(formattedValue);

    this.#renderedValue = output;
    this.#modelValue = formattedValue;
    this.#writeModelValue(formattedValue);

    this.#onChange?.(formattedValue);
  }

  // Clears the displayed color when the bound field's value is empty (for
  // example, `model.set(undefined)` or `form.reset()` on a field with no
  // value). Resets the input element, swatch, and dialog back to their
  // pre-value state rather than leaving a stale color displayed.
  #clearRenderedValue(): void {
    if (this.#renderedValue === undefined) {
      return;
    }

    this.#renderedValue = undefined;
    this.#modelValue = undefined;

    const element = this.#elementRef.nativeElement;
    this.#renderer.removeStyle(element, 'background-color');
    this.#renderer.setProperty(element, 'value', '');

    this.skyColorpickerInput.updatePickerValues(SKY_COLORPICKER_DEFAULT_COLOR);
    this.skyColorpickerInput.backgroundColorForDisplay = undefined;
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
