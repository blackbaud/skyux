import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchChange } from './types/toggle-switch-change';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_TOGGLE_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyToggleSwitchComponent),
  multi: true,
};
const SKY_TOGGLE_SWITCH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyToggleSwitchComponent),
  multi: true,
};
// tslint:enable

let uniqueId = 0;

@Component({
  selector: 'sky-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  providers: [
    SKY_TOGGLE_SWITCH_CONTROL_VALUE_ACCESSOR,
    SKY_TOGGLE_SWITCH_VALIDATOR,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyToggleSwitchComponent
  implements AfterContentInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * Specifies an ARIA label for the toggle switch. This sets the toggle switch's `aria-label`
   * attribute [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the `sky-toggle-switch-label` component displays a visible label, do not use this property.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Indicates whether the toggle switch is selected.
   * @default false
   */
  @Input()
  public set checked(checked: boolean) {
    if (checked !== this.checked) {
      this._checked = checked;
      this.onChange(checked);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
        this.isFirstChange = false;
      }
    }
  }

  public get checked(): boolean {
    return this._checked || false;
  }

  /**
   * Indicates whether to disable the toggle switch.
   */
  @Input()
  public disabled = false;

  /**
   * Specifies a tab index for the toggle switch. If not defined, the index is set to the position
   * of the toggle switch on load.
   */
  @Input()
  public tabIndex = 0;

  /**
   * Fires when the checked state of a toggle switch changes.
   */
  @Output()
  public toggleChange = new EventEmitter<SkyToggleSwitchChange>();

  public get hasLabelComponent(): boolean {
    return this.labelComponents.length > 0;
  }

  public enableIndicatorAnimation = false;

  public get labelElementId(): string {
    return `sky-toggle-switch-label-${this.toggleSwitchId}`;
  }

  @ContentChildren(SkyToggleSwitchLabelComponent)
  private labelComponents: QueryList<SkyToggleSwitchLabelComponent>;

  private control: AbstractControl;
  private isFirstChange = true;
  private ngUnsubscribe = new Subject<void>();
  private toggleSwitchId = uniqueId++;

  private _checked = false;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public ngAfterContentInit(): void {
    this.labelComponents.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        // Allow the template to reload any ARIA attributes that are relying on the
        // label component existing in the DOM.
        this.changeDetector.markForCheck();
      });

    // Wait for the view to render before applying animation effects.
    // (Some browsers, such as Firefox, apply the animation too early.)
    setTimeout(() => {
      this.enableIndicatorAnimation = true;
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public writeValue(value: boolean): void {
    this.checked = !!value;
    this.changeDetector.markForCheck();
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }

    return;
  }

  public registerOnChange(fn: (value: any) => void) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  public onButtonClick(event: any): void {
    event.stopPropagation();
    this.toggleChecked();
    this.emitChangeEvent();
  }

  public onButtonBlur(): void {
    this.onTouched();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: any) => void = () => {};

  private emitChangeEvent(): void {
    this.onChange(this._checked);
    this.toggleChange.emit({
      checked: this._checked,
    });
  }

  private toggleChecked(): void {
    this.checked = !this.checked;
  }
}
