
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';

import {
  ControlValueAccessor,
  NgControl
} from '@angular/forms';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  SkyFormsUtility
} from '../shared/forms-utility';

import {
  SkyCheckboxChange
} from './checkbox-change';

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
  styleUrls: ['./checkbox.component.scss']
})
export class SkyCheckboxComponent implements ControlValueAccessor, OnInit {

  /**
   * Specifies an ARIA label for the checkbox. This sets the checkbox's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility)
   * when the checkbox does not include a visible label. You must set this property for icon
   * checkboxes. If the checkbox includes a visible label, use `labelledBy` instead.
   */
  @Input()
  public label: string;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels the
   * checkbox. This sets the checkbox's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * If the checkbox does not include a visible label, use `label` instead.
   */
  @Input()
  public labelledBy: string;

  /**
   * Specifies an ID for the checkbox.
   * @default a unique, auto-incrementing integer. For example: `sky-checkbox-1`
   */
  @Input()
  public id: string = `sky-checkbox-${++nextId}`;

  /**
   * Indicates whether to disable the checkbox.
   */
  @Input()
  public disabled: boolean = false;

  /**
   * Specifies an index for the checkbox. If not defined, the index is set to the position of the
   * checkbox on load.
   */
  @Input()
  public tabindex: number = 0;

  /**
   * Specifies a name for a group of checkboxes.
   * @default a unique, auto-incrementing integer. For example: `sky-checkbox-1`
   */
  @Input()
  public name: string = `sky-checkbox-${++nextId}`;

  /**
   * Fires when the selected value changes.
   */
  @Output()
  public change = new EventEmitter<SkyCheckboxChange>();

  /**
   * Specifies an icon to display in place of the checkbox. To group icon checkboxes
   * like in the demo, place the `sky-switch-icon-group` class on the direct parent
   * element of the checkboxes.
   */
  @Input()
  public icon: String;

  /**
   * Specifies a type to set the background color after users select a checkbox where the
   * `icon` property displays an icon in place of the checkbox. The valid options correspond to
   * [the label component's](https://developer.blackbaud.com/skyux/components/label)
   * label types. `'info'` creates a blue background, `'success'` creates a green
   * background, `'warning'` creates an orange background, and `'danger'` creates a red background.
   * @default 'info'
   */
  @Input()
  public set checkboxType(value: string) {
    if (value) {
      this._checkboxType = value.toLowerCase();
    }
  }

  public get checkboxType(): string {
    return this._checkboxType || 'info';
  }

  public get inputId(): string {
    return `input-${this.id}`;
  }

  /**
   * Indicates whether the checkbox is selected.
   * @default false
   */
  @Input()
  public set checked(checked: boolean) {
    if (checked !== this.checked) {
      this._checked = checked;
      this._controlValueAccessorChangeFn(checked);
      this._checkedChange.next(this._checked);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.ngControl && this.ngControl.control) {
        this.ngControl.control.markAsPristine();
        this.isFirstChange = false;
      }
    }
  }

  public get checked() {
    return this._checked;
  }

  /**
   * Indicates whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   * @default false
   */
  @Input()
  set required(value: boolean) {
    this._required = SkyFormsUtility.coerceBooleanProperty(value);
  }

  get required(): boolean {
    return this._required;
  }

  /**
   * Fires when users select or deselect the checkbox.
   */
  @Output()
  public get checkedChange(): Observable<boolean> {
    return this._checkedChange;
  }

  private isFirstChange = true;

  private _checkboxType: string;

  private _checked: boolean = false;

  private _checkedChange = new BehaviorSubject<boolean>(this._checked);

  private _required: boolean = false;

  constructor(
    @Self() @Optional() private ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnInit(): void {
    if (this.ngControl) {
      // Backwards compatibility support for anyone still using Validators.Required.
      this.required = this.required || SkyFormsUtility.hasRequiredValidation(this.ngControl);
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public writeValue(value: any) {
    this.checked = !!value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   */
  public onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    if (!this.disabled) {
      this._toggle();
      this._emitChangeEvent();
    }
  }

  public onInputBlur() {
    this.onTouched();
  }

  /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
  /*istanbul ignore next */
  public onTouched: () => any = () => {};

  private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

  private _emitChangeEvent() {
    let event = new SkyCheckboxChange();
    event.source = this;
    event.checked = this._checked;

    this._controlValueAccessorChangeFn(this._checked);
    this.change.emit(event);
  }

  /**
   * Toggles the `checked` value between true and false
   */
  private _toggle() {
    this.checked = !this.checked;
  }

}
