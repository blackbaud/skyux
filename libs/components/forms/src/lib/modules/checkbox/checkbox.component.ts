import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { SkyIdService, SkyLogService } from '@skyux/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { SkyFormsUtility } from '../shared/forms-utility';

import { SkyCheckboxChange } from './checkbox-change';

/**
 * Replaces the HTML input element with `type="checkbox"`. When users select a checkbox, its value
 * is driven through an `ngModel` attribute that you specify on the `sky-checkbox` element.
 */
@Component({
  selector: 'sky-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
})
export class SkyCheckboxComponent implements ControlValueAccessor, OnInit {
  /**
   * The ARIA label for the checkbox. This sets the checkbox's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility)
   * when the checkbox does not include a visible label. You must set this property for icon
   * checkboxes. If the checkbox includes a visible label, use `labelledBy` instead.
   * @deprecated Use `labelText` instead.
   */
  @Input()
  public set label(value: string | undefined) {
    this.#_label = value;

    if (value) {
      this.#logger.deprecated('SkyCheckboxComponent.label', {
        deprecationMajorVersion: 9,
      });
    }
  }

  public get label(): string | undefined {
    return this.#_label;
  }

  /**
   * The HTML element ID of the element that labels the
   * checkbox. This sets the checkbox's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * If the checkbox does not include a visible label, use `label` instead.
   * @deprecated Use `labelText` instead.
   */
  @Input()
  public set labelledBy(value: string | undefined) {
    this.#_labelledBy = value;

    if (value) {
      this.#logger.deprecated('SkyCheckboxComponent.labelledBy', {
        deprecationMajorVersion: 9,
      });
    }
  }

  public get labelledBy(): string | undefined {
    return this.#_labelledBy;
  }

  /**
   * The ID for the checkbox.
   * If a value is not provided, an autogenerated ID is used.
   */
  @Input()
  public set id(value: string | undefined) {
    if (value) {
      this.inputId = `sky-checkbox-${value}-input`;
    } else {
      this.inputId = `sky-checkbox-${this.#defaultId}-input`;
    }
  }

  /**
   * Whether to disable the checkbox on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
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
   * Whether the checkbox is disabled.
   */
  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * The index for the checkbox. If not defined, the index is set to the position of the
   * checkbox on load.
   */
  @Input()
  public tabindex: number | undefined = 0;

  /**
   * The name for the checkbox.
   * If a value is not provided, an autogenerated ID is used.
   */
  @Input()
  public set name(value: string | undefined) {
    if (value && value !== this.#defaultId) {
      this.#_name = value;
    } else {
      this.#_name = `sky-checkbox-${this.#defaultId}`;
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
   * The icon to display in place of the checkbox. To group icon checkboxes
   * like in the demo, place the `sky-switch-icon-group` class on the direct parent
   * element of the checkboxes.
   */
  @Input()
  public icon: string | undefined;

  /**
   * The background color type after users select a checkbox where the
   * `icon` property displays an icon in place of the checkbox. The valid options correspond to
   * [the label component's](https://developer.blackbaud.com/skyux/components/label)
   * label types. `"info"` creates a blue background, `"success"` creates a green
   * background, `"warning"` creates an orange background, and `"danger"` creates a red background.
   * @default "info"
   * @deprecated checkboxType is no longer supported
   */
  @Input()
  public set checkboxType(value: string | undefined) {
    if (value) {
      this.#logger.deprecated('SkyCheckboxComponent.checkboxType', {
        deprecationMajorVersion: 7,
      });
    }

    this.#_checkboxType = value ? value.toLowerCase() : 'info';
  }

  public get checkboxType(): string {
    return this.#_checkboxType;
  }

  /**
   * Whether the checkbox is selected.
   * @default false
   */
  @Input()
  public set checked(value: boolean | undefined) {
    const checked = !!value;
    if (checked !== this.#_checked) {
      this.#_checked = checked;
      this.#checkedChange.next(checked);
    }
  }

  /**
   * Whether the checkbox is selected.
   */
  public get checked(): boolean {
    return this.#_checked;
  }

  /**
   * Whether the checkbox is in the indeterminate state. This has no visual effect for icon checkboxes.
   * @internal
   */
  @Input()
  public set indeterminate(value: boolean | undefined) {
    this.#_indeterminate = !!value;
    this.#indeterminateChange.next(this.#_indeterminate);
    if (this.inputEl) {
      this.inputEl.nativeElement.indeterminate = this.#_indeterminate;
      this.#changeDetector.markForCheck();
    }
  }

  public get indeterminate(): boolean {
    return this.#_indeterminate;
  }

  /**
   * Whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   * @default false
   */
  @Input()
  public set required(value: boolean | undefined) {
    this.#_required = SkyFormsUtility.coerceBooleanProperty(value);
    this.#setValidators();
  }

  public get required(): boolean {
    return this.#_required;
  }

  /**
   * The text to display as the checkbox's label. Use this instead of the `sky-checkbox-label` when the label is text-only.
   * Specifying `labelText` also enables automatic error message handling for checkbox.
   * @preview
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Indicates whether to hide the `labelText`.
   */
  @Input()
  public labelHidden: boolean = false;

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

  /**
   * Fires when the indeterminate state changes.
   * @internal
   */
  @Output()
  public get indeterminateChange(): Observable<boolean> {
    return this.#indeterminateChangeObs;
  }

  @ViewChild('inputEl', { read: ElementRef })
  public set inputEl(el: ElementRef | undefined) {
    this.#_inputEl = el;
    if (el && this.indeterminate) {
      el.nativeElement.indeterminate = this.indeterminate;
    }
  }

  public get inputEl(): ElementRef | undefined {
    return this.#_inputEl;
  }

  protected inputId = '';

  #checkedChange: BehaviorSubject<boolean>;
  #checkedChangeObs: Observable<boolean>;
  #disabledChange: BehaviorSubject<boolean>;
  #disabledChangeObs: Observable<boolean>;
  #indeterminateChange: BehaviorSubject<boolean>;
  #indeterminateChangeObs: Observable<boolean>;

  #_checked = false;
  #_checkboxType = 'info';
  #_disabled = false;
  #_indeterminate = false;
  #_inputEl: ElementRef | undefined;
  #_name = '';
  #_required = false;
  #_label: string | undefined;
  #_labelledBy: string | undefined;

  #changeDetector = inject(ChangeDetectorRef);
  #idSvc = inject(SkyIdService);
  #defaultId = this.#idSvc.generateId();
  #logger = inject(SkyLogService);

  protected readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });
  protected readonly errorId = this.#idSvc.generateId();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.#checkedChange = new BehaviorSubject<boolean>(this.checked);
    this.#disabledChange = new BehaviorSubject<boolean>(this.disabled);
    this.#indeterminateChange = new BehaviorSubject<boolean>(this.disabled);

    this.#checkedChangeObs = this.#checkedChange.asObservable();
    this.#disabledChangeObs = this.#disabledChange.asObservable();
    this.#indeterminateChangeObs = this.#indeterminateChange.asObservable();

    this.id = this.#defaultId;
    this.name = this.#defaultId;
  }

  public ngOnInit(): void {
    if (this.ngControl) {
      // Backwards compatibility support for anyone still using Validators.Required.
      this.required =
        this.required || SkyFormsUtility.hasRequiredValidation(this.ngControl);
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
      this.indeterminate = false;
      this.#toggle();
      this.#controlValueAccessorChangeFn(this.checked);
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
    this.change.emit({ checked: this.checked });
  }

  /**
   * Toggles the `checked` value between true and false
   */
  #toggle(): void {
    this.checked = !this.checked;
  }

  #setValidators(): void {
    if (
      this.required &&
      !this.ngControl?.control?.hasValidator(Validators.requiredTrue)
    ) {
      this.ngControl?.control?.addValidators(Validators.requiredTrue);
      this.ngControl?.control?.updateValueAndValidity();
    } else if (
      !this.required &&
      this.ngControl?.control?.hasValidator(Validators.requiredTrue)
    ) {
      this.ngControl.control.removeValidators(Validators.requiredTrue);
      this.ngControl.control?.updateValueAndValidity();
    }
  }
}
