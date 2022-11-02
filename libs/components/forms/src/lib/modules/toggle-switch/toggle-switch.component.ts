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
  ViewChild,
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
import { SkyIdService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchChange } from './types/toggle-switch-change';

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
  public ariaLabel: string | undefined;

  /**
   * Indicates whether the toggle switch is selected.
   * @default false
   */
  @Input()
  public set checked(value: boolean | undefined) {
    const checked = !!value;
    if (checked !== this.#_checked) {
      this.#_checked = checked;
      this.#onChange(checked);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.#isFirstChange && this.#control) {
        this.#control.markAsPristine();
        this.#isFirstChange = false;
      }
    }
  }

  public get checked(): boolean {
    return this.#_checked;
  }

  /**
   * Indicates whether to disable the toggle switch.
   */
  @Input()
  public disabled: boolean | undefined = false;

  /**
   * Specifies a tab index for the toggle switch. If not defined, the index is set to the position
   * of the toggle switch on load.
   */
  @Input()
  public tabIndex: number | undefined = 0;

  /**
   * Fires when the checked state of a toggle switch changes.
   */
  @Output()
  public toggleChange = new EventEmitter<SkyToggleSwitchChange>();

  public hasLabelComponent = false;
  public labelId: string;

  public enableIndicatorAnimation = false;

  @ContentChildren(SkyToggleSwitchLabelComponent)
  public labelComponents: QueryList<SkyToggleSwitchLabelComponent> | undefined;

  @ViewChild('toggleLabel')
  public toggleLabelEl: HTMLLabelElement | undefined;

  #control: AbstractControl | undefined;
  #isFirstChange = true;
  #ngUnsubscribe = new Subject<void>();

  #_checked = false;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef, idService: SkyIdService) {
    this.#changeDetector = changeDetector;
    this.labelId = idService.generateId();
  }

  public ngAfterContentInit(): void {
    /* istanbul ignore else */
    if (this.labelComponents) {
      this.hasLabelComponent = this.labelComponents.length > 0;

      this.labelComponents.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((newLabelComponents) => {
          this.hasLabelComponent = newLabelComponents.length > 0;
          // Allow the template to reload any ARIA attributes that are relying on the
          // label component existing in the DOM.
          this.#changeDetector.markForCheck();
        });
    }

    // Wait for the view to render before applying animation effects.
    // (Some browsers, such as Firefox, apply the animation too early.)
    setTimeout(() => {
      this.enableIndicatorAnimation = true;
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public writeValue(value: boolean): void {
    this.checked = !!value;
    this.#changeDetector.markForCheck();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    return null;
  }

  public registerOnChange(fn: (value: any) => void) {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.#changeDetector.markForCheck();
  }

  public onButtonClick(event: any): void {
    event.stopPropagation();
    this.#toggleChecked();
    this.#emitChangeEvent();
  }

  public onButtonBlur(): void {
    this.#onTouched();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  /* istanbul ignore next */
  #onTouched: () => any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  /* istanbul ignore next */
  #onChange: (value: any) => void = () => {};

  #emitChangeEvent(): void {
    this.#onChange(this.#_checked);
    this.toggleChange.emit({
      checked: this.#_checked,
    });
  }

  #toggleChecked(): void {
    this.checked = !this.checked;
  }
}
