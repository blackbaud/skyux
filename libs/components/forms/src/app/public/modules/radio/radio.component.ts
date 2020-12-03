// #region imports
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  Provider
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  Observable
} from 'rxjs';

import {
  SkyFormsUtility
} from '../shared/forms-utility';

import {
  SkyRadioChange
} from './types/radio-change';
// #endregion

/**
 * Auto-incrementing integer used to generate unique ids for radio components.
 */
let nextUniqueId = 0;

/**
 * Provider Expression that allows sky-radio to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 */
// tslint:disable:no-forward-ref no-use-before-declare
const SKY_RADIO_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyRadioComponent),
  multi: true
};
// tslint:enable

/**
 * Renders a SKY UX-themed replacement for an HTML `input` element
 * with `type="radio"`. When users select a radio button, its value is driven through an
 * `ngModel` attribute that you specify on the `sky-radio` element or the parent `sky-radio-group` element.
 */
@Component({
  selector: 'sky-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  providers: [
    SKY_RADIO_CONTROL_VALUE_ACCESSOR
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyRadioComponent implements OnDestroy, ControlValueAccessor {
/**
 * Indicates whether the radio button is selected.
 * @default false
 */
  @Input()
  public set checked(value: boolean) {
    const newCheckedState = !!value;

    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;

      if (newCheckedState) {
        this.selectedValue = this.value;
      }
    }

    this.changeDetector.markForCheck();
  }

  public get checked(): boolean {
    return this._checked;
  }

  /**
   * Indicates whether to disable the input.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    const newDisabledState = SkyFormsUtility.coerceBooleanProperty(value);
    if (this._disabled !== newDisabledState) {
      this._disabled = newDisabledState;
      this.changeDetector.markForCheck();
    }
  }

  public get disabled(): boolean {
    return this._disabled;
  }

/**
 * Specifies an ID for the radio button.
 * @default a unique, auto-incrementing integer. For example: `sky-radio-1`
 */
  @Input()
  public id = `sky-radio-${++nextUniqueId}`;

/**
 * Specifies an ARIA label for the radio button. This sets the radio button's `aria-label`
 * attribute [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
 * when the radio button does not include a visible label. You must set this property for icon
 * radio buttons. If the radio button includes a visible label, use `labelledBy` instead.
 */
  @Input()
  public label: string;

/**
 * Specifies the HTML element ID (without the leading `#`) of the element that labels
 * the radio button. This sets the radio button's `aria-labelledby` attribute
 * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
 * If the radio button does not include a visible label, use `label` instead.
 */
  @Input()
  public labelledBy: string;

// tslint:disable: max-line-length
/**
 * This property is deprecated in favor of the `name` property on the `sky-radio-group element`.
 * We recommend using the `sky-radio-group` element with all radio buttons, but if you opt not to,
 * then this property specifies a name for a group of radio buttons.
 * @deprecated
 */
// tslint:enable: max-line-length
  @Input()
  public set name(value: string) {
    this._name = value;
    this.changeDetector.detectChanges();
  }

  public get name(): string {
    return this._name;
  }

 // tslint:disable: max-line-length
/**
 * This property is deprecated in favor of
 * the `tabIndex` property on the `sky-radio-group` element. It specifies an index for the radio button.
 * If the index is not defined, it is set to the position of the radio button on load.
 * @deprecated
 */
// tslint:enable: max-line-length
  @Input()
  public set tabindex(value: number) {
    console.warn('The sky-radio `tabindex` property is deprecated. Please use the `tabindex` property on the sky-radio-group component.');
    this._tabindex = value;
    this.changeDetector.detectChanges();
  }
  public get tabindex(): number {
    return this._tabindex || 0;
  }

  // For setting the tabindex from the radio group
  public set groupTabIndex(value: number) {
    this._tabindex = value;
    this.changeDetector.detectChanges();
  }

/**
 * Specifies and binds a value to the radio button's `value` property. The value usually corresponds
 * to the radio button's label, which you specify with the `sky-radio-label` component.
 * @required
 */
  @Input()
  public set value(value: any) {
    if (this._value !== value) {
      if (this.selectedValue && this.selectedValue === this._value) {
        this.selectedValue = value;
        this.onChangeCallback(this.selectedValue);
        this.onTouchedCallback();
      }

      this._value = value;
    }

    this.changeDetector.markForCheck();
  }

  public get value(): any {
    return this._value;
  }

/**
 * Specifies an icon to display in place of the radio button. To group radio buttons like in
 * the demo above, place the `sky-switch-icon-group` class on the direct parent element of the radio buttons.
 */
  @Input()
  public icon: string;

/**
 * Specifies a type to set the background color after users select an icon radio button.
 * The valid options correspond
 * [the label component's](https://developer.blackbaud.com/skyux/components/label)
 * label types. `danger` creates a red background, `info` creates a blue background,
 * `success` creates a green background, and `warning` creates an orange background.
 * @default "info"
 */
  @Input()
  public get radioType(): string {
    return this._radioType || 'info';
  }
  public set radioType(value: string) {
    if (value) {
      this._radioType = value.toLowerCase();
    }
  }

/**
 * Fires when users select a radio button.
 */
  @Output()
  public get change(): Observable<SkyRadioChange> {
    return this._change;
  }
  public get inputId(): string {
    return `sky-radio-${this.id}-input`;
  }

  public set selectedValue(value: any) {
    if (value !== this._selectedValue) {
      this._selectedValue = value;
    }
  }
  public get selectedValue(): any {
    return this._selectedValue;
  }

  private _change = new EventEmitter<SkyRadioChange>();
  private _checked = false;
  private _disabled: boolean = false;
  private _name: string;
  private _radioType: string;
  private _selectedValue: any;
  private _tabindex: number;
  private _value: any;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnDestroy(): void {
    this.removeUniqueSelectionListener();
  }

  public writeValue(value: any): void {
    if (value === undefined) {
      return;
    }

    this.selectedValue = value;
    this.checked = this.value === this.selectedValue;

    this.changeDetector.markForCheck();
  }

  /**
   * @internal
   * Indicates whether to disable the control. Implemented as a part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public onInputChange(event: Event): void {
    event.stopPropagation();

    if (!this.disabled) {
      this.checked = true;
      this._change.emit({
        source: this,
        value: this._value
      });

      this.onInputFocusChange(undefined);
      this.onChangeCallback(this.value);
    }
  }

  public onInputFocusChange(event: Event): void {
    this.onTouchedCallback();
  }

  /* istanbul ignore next */
  private removeUniqueSelectionListener = () => {};
  /* istanbul ignore next */
  private onChangeCallback = (value: any) => {};
  /* istanbul ignore next */
  private onTouchedCallback = () => {};
}
