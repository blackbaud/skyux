import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { SkyFormsUtility, SkyIdService, SkyLogService } from '@skyux/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { SkyFormFieldLabelTextRequiredService } from '../shared/form-field-label-text-required.service';

import { SkyCheckboxChange } from './checkbox-change';

/**
 * Replaces the HTML input element with `type="checkbox"`. When users select a checkbox, its value
 * is driven through an `ngModel` attribute that you specify on the `sky-checkbox` element.
 */
@Component({
  providers: [
    { provide: NG_VALIDATORS, useExisting: SkyCheckboxComponent, multi: true },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SkyCheckboxComponent,
      multi: true,
    },
    { provide: SKY_FORM_ERRORS_ENABLED, useValue: true },
  ],
  selector: 'sky-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
})
export class SkyCheckboxComponent
  implements ControlValueAccessor, OnInit, Validator
{
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
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the checkbox label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   * @preview
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   * @preview
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * Fires when the selected value changes.
   */
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  public change = new EventEmitter<SkyCheckboxChange>();

  /**
   * The icon to display in place of the checkbox. To group icon checkboxes
   * like in the demo, place the checkboxes within a `sky-checkbox-group`.
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
   * The text to display as the checkbox's label. Use this instead of the `sky-checkbox-label` when the label is text-only.
   * Specifying `labelText` also enables automatic error message handling for checkbox.
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
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   * @preview
   */
  @Input()
  public hintText: string | undefined;

  /**
   * @internal
   */
  @Input({ transform: booleanAttribute })
  public required = false;

  /**
   * Whether the checkbox is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the checkbox. If the checkbox is within a checkbox group,
   * set `stacked` on the checkbox group component instead.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-lg')
  public stacked = false;

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

  @HostBinding('style.display')
  public display: string | undefined;

  protected get isCheckboxRequired(): boolean {
    return !!(
      this.required ??
      this.control?.hasValidator(Validators.requiredTrue) ??
      this.control?.hasValidator(Validators.required)
    );
  }

  protected control: AbstractControl | undefined;
  protected inputId = '';

  protected readonly errorId: string;

  #checkedChange: BehaviorSubject<boolean>;
  #checkedChangeObs: Observable<boolean>;
  #defaultId: string;
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
  #_label: string | undefined;
  #_labelledBy: string | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #idSvc = inject(SkyIdService);
  readonly #labelTextRequired = inject(SkyFormFieldLabelTextRequiredService, {
    optional: true,
  });
  readonly #logger = inject(SkyLogService);

  constructor() {
    this.#defaultId = this.#idSvc.generateId();

    this.#checkedChange = new BehaviorSubject<boolean>(this.checked);
    this.#disabledChange = new BehaviorSubject<boolean>(this.disabled);
    this.#indeterminateChange = new BehaviorSubject<boolean>(this.disabled);

    this.#checkedChangeObs = this.#checkedChange.asObservable();
    this.#disabledChangeObs = this.#disabledChange.asObservable();
    this.#indeterminateChangeObs = this.#indeterminateChange.asObservable();

    this.errorId = this.#idSvc.generateId();
    this.id = this.#defaultId;
    this.name = this.#defaultId;
  }

  public ngOnInit(): void {
    if (this.#labelTextRequired && !this.labelText) {
      this.display = 'none';
    }

    this.#labelTextRequired?.validateLabelText(this.labelText);
  }

  public validate(control: AbstractControl<boolean>): ValidationErrors | null {
    this.control ||= control;

    // In template-driven forms, Angular's native 'required' attribute directive only works
    // on `input[type="checkbox"]` selectors, so we need to write the validation logic ourselves.
    return this.required && control.value !== true ? { required: true } : null;
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
}
