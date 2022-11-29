import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyFormsUtility } from '../shared/forms-utility';

import { SkyCheckboxChange } from './checkbox-change';

/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
let nextId = 0;

/**
 * Replaces the HTML input element with `type="checkbox"`. When users select a checkbox, its value
 * is driven through an `ngModel` attribute that you specify on the `sky-checkbox` element.
 */
@Component({
  selector: 'sky-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class SkyCheckboxComponent implements ControlValueAccessor, OnInit {
  /**
   * Specifies an ARIA label for the checkbox. This sets the checkbox's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility)
   * when the checkbox does not include a visible label. You must set this property for icon
   * checkboxes. If the checkbox includes a visible label, use `labelledBy` instead.
   */
  @Input()
  public label: string | undefined;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels the
   * checkbox. This sets the checkbox's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * If the checkbox does not include a visible label, use `label` instead.
   */
  @Input()
  public labelledBy: string | undefined;

  /**
   * Specifies an ID for the checkbox.
   * @default a unique, auto-incrementing integer. For example: `sky-checkbox-1`
   */
  @Input()
  public set id(value: string | undefined) {
    if (value) {
      this.#_id = `sky-checkbox-${value}`;
    } else {
      this.#_id = `${this.#defaultId}`;
    }
    this.inputId = `input-${this.#_id}`;
  }

  // TODO: In a future breaking change - remove this getter. It is not used - only the `inputId` is used;
  // however, this component is returned by the `SkyCheckboxChange` and thus removing this would be a breaking change.
  public get id(): string {
    return this.#_id;
  }

  /**
   * Indicates whether to disable the checkbox.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    const coercedValue = SkyFormsUtility.coerceBooleanProperty(value);
    if (coercedValue !== this.#_disabled) {
      this.#_disabled = coercedValue;
      this.#disabledChange.next(coercedValue);
    }
  }

  /**
   * Indicates whether the checkbox is disabled.
   */
  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Specifies an index for the checkbox. If not defined, the index is set to the position of the
   * checkbox on load.
   */
  @Input()
  public tabindex: number | undefined = 0;

  /**
   * Specifies a name for a group of checkboxes.
   * @default a unique, auto-incrementing integer. For example: `sky-checkbox-1`
   */
  @Input()
  public set name(value: string | undefined) {
    if (value) {
      this.#_name = value;
    } else {
      this.#_name = this.#defaultId;
    }
  }

  public get name(): string {
    return this.#_name;
  }

  /**
   * Fires when the selected value changes.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change = new EventEmitter<SkyCheckboxChange>();

  /**
   * Specifies an icon to display in place of the checkbox. To group icon checkboxes
   * like in the demo, place the `sky-switch-icon-group` class on the direct parent
   * element of the checkboxes.
   */
  @Input()
  public icon: string | undefined;

  /**
   * Specifies a type to set the background color after users select a checkbox where the
   * `icon` property displays an icon in place of the checkbox. The valid options correspond to
   * [the label component's](https://developer.blackbaud.com/skyux/components/label)
   * label types. `"info"` creates a blue background, `"success"` creates a green
   * background, `"warning"` creates an orange background, and `"danger"` creates a red background.
   * @default "info"
   */
  @Input()
  public set checkboxType(value: string | undefined) {
    this.#_checkboxType = value ? value.toLowerCase() : 'info';
  }

  public get checkboxType(): string {
    return this.#_checkboxType;
  }

  public inputId = '';

  /**
   * Indicates whether the checkbox is selected.
   * @default false
   */
  @Input()
  public set checked(value: boolean | undefined) {
    const checked = !!value;
    if (checked !== this.#_checked) {
      this.#_checked = checked;
      this.#controlValueAccessorChangeFn(checked);
      this.#checkedChange.next(checked);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.#isFirstChange && this.#ngControl && this.#ngControl.control) {
        this.#ngControl.control.markAsPristine();
        this.#isFirstChange = false;
      }
    }
  }

  /**
   * Indicates whether the checkbox is selected.
   */
  public get checked(): boolean {
    return this.#_checked;
  }

  /**
   * Indicates whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   * @default false
   */
  @Input()
  set required(value: boolean | undefined) {
    this.#_required = SkyFormsUtility.coerceBooleanProperty(value);
  }

  get required(): boolean {
    return this.#_required;
  }

  /**
   * Fires when users select or deselect the checkbox.
   */
  @Output()
  public get checkedChange(): Observable<boolean> {
    return this.#checkedChangeObs;
  }

  /**
   * Fires when the selected value changes.
   */
  @Output()
  public get disabledChange(): Observable<boolean> {
    return this.#disabledChangeObs;
  }

  #checkedChange: BehaviorSubject<boolean>;

  #checkedChangeObs: Observable<boolean>;

  #defaultId = `sky-checkbox-${++nextId}`;

  #disabledChange: BehaviorSubject<boolean>;

  #disabledChangeObs: Observable<boolean>;

  #isFirstChange = true;

  #_checked = false;

  #_checkboxType = 'info';

  #_disabled = false;

  #_id = '';

  #_name = '';

  #_required = false;

  #ngControl: NgControl | undefined;

  constructor(@Self() @Optional() ngControl: NgControl) {
    this.#ngControl = ngControl;
    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    this.#checkedChange = new BehaviorSubject<boolean>(this.checked);
    this.#disabledChange = new BehaviorSubject<boolean>(this.disabled);

    this.#checkedChangeObs = this.#checkedChange.asObservable();
    this.#disabledChangeObs = this.#disabledChange.asObservable();

    this.id = this.#defaultId;
    this.name = this.#defaultId;
  }

  public ngOnInit(): void {
    if (this.#ngControl) {
      // Backwards compatibility support for anyone still using Validators.Required.
      this.required =
        this.required || SkyFormsUtility.hasRequiredValidation(this.#ngControl);
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public writeValue(value: any): void {
    this.checked = !!value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnChange(fn: (value: any) => void): void {
    this.#controlValueAccessorChangeFn = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   */
  public onInteractionEvent(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    if (!this.disabled) {
      this.#toggle();
      this.#emitChangeEvent();
    }
  }

  public onInputBlur(): void {
    this.onTouched();
  }

  /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // istanbul ignore next
  public onTouched: () => any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #controlValueAccessorChangeFn: (value: any) => void = (value) => {};

  #emitChangeEvent(): void {
    this.#controlValueAccessorChangeFn(this.checked);
    this.change.emit({ source: this, checked: this.checked });
  }

  /**
   * Toggles the `checked` value between true and false
   */
  #toggle(): void {
    this.checked = !this.checked;
  }
}
