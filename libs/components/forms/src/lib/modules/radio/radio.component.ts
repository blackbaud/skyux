import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Provider,
  booleanAttribute,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SkyFormsUtility, SkyIdService, SkyLogService } from '@skyux/core';

import { Subject } from 'rxjs';

import { SkyFormFieldLabelTextRequiredService } from '../shared/form-field-label-text-required.service';

import { SkyRadioGroupIdService } from './radio-group-id.service';
import { SkyRadioChange } from './types/radio-change';
import { SkyRadioType } from './types/radio-type';

/**
 * Provider Expression that allows sky-radio to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
const SKY_RADIO_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyRadioComponent),
  multi: true,
};

/**
 * Renders a SKY UX-themed replacement for an HTML `input` element
 * with `type="radio"`. When users select a radio button, its value is driven through an
 * `ngModel` attribute that you specify on the `sky-radio` element or the parent `sky-radio-group` element.
 */
@Component({
  selector: 'sky-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [SKY_RADIO_CONTROL_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyRadioComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  /**
   * Fires when users focus off a radio button.
   */
  public blur = new Subject<void>();

  /**
   * Whether the radio button is selected.
   * @default false
   */
  @Input()
  public set checked(value: boolean | undefined) {
    const newCheckedState = !!value;

    if (this.#_checked !== newCheckedState) {
      this.#_checked = newCheckedState;
      this.checkedChange.next(newCheckedState);

      if (newCheckedState) {
        this.selectedValue = this.value;
      }
    }

    this.#changeDetector.markForCheck();
  }

  public get checked(): boolean {
    return this.#_checked;
  }

  /**
   * Whether to disable the input on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    const coercedValue = SkyFormsUtility.coerceBooleanProperty(value);
    if (coercedValue !== this.disabled) {
      this.#_disabled = coercedValue;
      this.disabledChange.next(coercedValue);
      this.#changeDetector.markForCheck();
    }
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The ID for the radio button.
   * If a value is not provided, an autogenerated ID is used.
   */
  @Input()
  public set id(value: string | undefined) {
    if (value) {
      this.inputId = `sky-radio-${value}-input`;
    } else {
      this.inputId = `sky-radio-${this.#defaultId}-input`;
    }
    this.#radioGroupIdSvc?.register(this.#defaultId, this.inputId);
  }

  /**
   * The ARIA label for the radio button. This sets the radio button's `aria-label`
   * attribute to provide a text equivalent for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * when the radio button does not include a visible label. You must set this property for icon
   * radio buttons. If the radio button includes a visible label, use `labelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @deprecated Use `labelText` instead.
   */
  @Input()
  public set label(value: string | undefined) {
    this.#_label = value;

    if (value) {
      this.#logger.deprecated('SkyRadioComponent.label', {
        deprecationMajorVersion: 10,
        replacementRecommendation: 'Use the `labelText` input instead.',
      });
    }
  }

  public get label(): string | undefined {
    return this.#_label;
  }

  /**
   * The HTML element ID of the element that labels
   * the radio button. This sets the radio button's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the radio button does not include a visible label, use `label` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   * @deprecated Use `labelText` instead.
   */
  @Input()
  public set labelledBy(value: string | undefined) {
    this.#_labelledBy = value;

    if (value) {
      this.#logger.deprecated('SkyRadioComponent.labelledBy', {
        deprecationMajorVersion: 10,
        replacementRecommendation: 'Use the `labelText` input instead.',
      });
    }
  }

  public get labelledBy(): string | undefined {
    return this.#_labelledBy;
  }

  /**
   * This property is deprecated in favor of the `name` property on the `sky-radio-group element`.
   * We recommend using the `sky-radio-group` element with all radio buttons, but if you opt not to,
   * then this property specifies a name for a group of radio buttons.
   * @deprecated
   */
  @Input()
  public set name(value: string | undefined) {
    this.#_name = value;
    this.#changeDetector.markForCheck();
  }

  public get name(): string | undefined {
    return this.#_name;
  }

  /**
   * This property is deprecated in favor of
   * the `tabIndex` property on the `sky-radio-group` element. It specifies an index for the radio
   * button. If the index is not defined, it is set to the position of the radio button on load.
   * @deprecated
   */
  @Input()
  public set tabindex(value: number | undefined) {
    console.warn(
      'The sky-radio `tabindex` property is deprecated. Please use the `tabindex` property on the sky-radio-group component.',
    );
    if (value) {
      this.#_tabindex = value;
    } else {
      this.#_tabindex = 0;
    }
    this.#changeDetector.markForCheck();
  }
  public get tabindex(): number {
    return this.#_tabindex;
  }

  // For setting the tabindex from the radio group
  public set groupTabIndex(value: number | undefined) {
    if (value) {
      this.#_tabindex = value;
    } else {
      this.#_tabindex = 0;
    }

    this.#changeDetector.markForCheck();
  }

  /**
   * The value bound to the radio button's `value` property. The value usually
   * corresponds to the radio button's label, which you specify with the `sky-radio-label`
   * component.
   * @required
   */
  @Input()
  public set value(value: any) {
    /* istanbul ignore else */
    if (this.#_value !== value) {
      if (this.selectedValue && this.selectedValue === this.#_value) {
        this.selectedValue = value;
        this.#onChangeCallback(this.selectedValue);
        this.#onTouchedCallback();
      }

      this.#_value = value;
    }

    this.#changeDetector.markForCheck();
  }

  public get value(): any {
    return this.#_value;
  }

  /**
   * The icon to display in place of the radio button. To group radio buttons like in
   * the demo above, place the `sky-switch-icon-group` class on the direct parent element of the
   * radio buttons.
   */
  @Input()
  public icon: string | undefined;

  /**
   * The background color type after users select an icon radio button.
   * The valid options correspond
   * [the label component's](https://developer.blackbaud.com/skyux/components/label)
   * label types. `danger` creates a red background, `info` creates a blue background,
   * `success` creates a green background, and `warning` creates an orange background.
   * @default "info"
   * @deprecated radioType is no longer supported
   */
  @Input()
  public get radioType(): SkyRadioType {
    return this.#_radioType;
  }
  public set radioType(value: SkyRadioType | undefined) {
    if (value) {
      this.#logger.deprecated('SkyRadioComponent.radioType', {
        deprecationMajorVersion: 7,
      });
    }

    this.#_radioType = value ?? 'info';
  }

  /**
   * The text to display as the radio button's label. Use this instead of the `sky-radio-label` when the label is text-only.
   * @preview
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Indicates whether to hide the `labelText`.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * Fires when users select a radio button.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change = new EventEmitter<SkyRadioChange>();

  /**
   * Fires when the selected value changes.
   */
  @Output()
  public checkedChange = new EventEmitter<boolean>();

  /**
   * Fires when the selected value changes.
   */
  @Output()
  public disabledChange = new EventEmitter<boolean>();

  @HostBinding('style.display')
  public display: string | undefined;

  public set selectedValue(value: any) {
    if (value !== this.#_selectedValue) {
      this.#_selectedValue = value;
    }
  }
  public get selectedValue(): any {
    return this.#_selectedValue;
  }

  public radioGroupDisabled = false;

  protected inputId = '';

  #_checked = false;
  #_disabled = false;
  #_name: string | undefined;
  #_radioType: SkyRadioType = 'info';
  #_selectedValue: unknown;
  #_tabindex = 0;
  #_value: any;
  #_label: string | undefined;
  #_labelledBy: string | undefined;

  #changeDetector = inject(ChangeDetectorRef);
  #defaultId = inject(SkyIdService).generateId();
  #radioGroupIdSvc = inject(SkyRadioGroupIdService, { optional: true });
  #logger = inject(SkyLogService);

  readonly #labelTextRequired = inject(SkyFormFieldLabelTextRequiredService, {
    optional: true,
  });

  constructor() {
    this.id = this.#defaultId;
  }

  public ngOnInit(): void {
    if (this.#labelTextRequired && !this.labelText) {
      this.display = 'none';
    }
    this.#labelTextRequired?.validateLabelText(this.labelText);
  }

  public ngOnDestroy(): void {
    this.#radioGroupIdSvc?.unregister(this.#defaultId);
    this.#removeUniqueSelectionListener();
    this.change.complete();
    this.checkedChange.complete();
    this.disabledChange.complete();
  }

  public writeValue(value: unknown): void {
    if (value === undefined) {
      return;
    }

    this.selectedValue = value;
    this.checked = this.value === this.selectedValue;

    this.#changeDetector.markForCheck();
  }

  /**
   * @internal
   * Whether to disable the control. Implemented as a part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public setGroupDisabledState(isDisabled: boolean) {
    this.radioGroupDisabled = isDisabled;
    this.#changeDetector.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this.#onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.#onTouchedCallback = fn;
  }

  public onInputChange(event: Event): void {
    event.stopPropagation();

    if (!this.disabled) {
      this.checked = true;
      this.change.next({
        value: this.value,
      });

      this.onInputFocusChange();
      this.#onChangeCallback(this.value);
    }
  }

  public onInputFocusChange(): void {
    this.#onTouchedCallback();
    this.blur.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #removeUniqueSelectionListener = (): void => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onChangeCallback = (value: any): void => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouchedCallback = (): void => {};
}
