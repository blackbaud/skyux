import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyFormsUtility } from '../shared/forms-utility';

import { SkyRadioGroupIdService } from './radio-group-id.service';
import { SkyRadioComponent } from './radio.component';
import { SkyRadioChange } from './types/radio-change';

let nextUniqueId = 0;

/**
 * Organizes radio buttons into a group. It is required for radio
 * buttons on Angular reactive forms, and we recommend using it with all radio buttons.
 * On Angular forms, the component manages the selected values and keeps the forms up-to-date.
 * When users select a radio button, its value is driven through an `ngModel` attribute that you specify on the `sky-radio-group` element.
 */
@Component({
  selector: 'sky-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [SkyRadioGroupIdService],
})
export class SkyRadioGroupComponent
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the radio button group. This sets the radio button group's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the radio button group does not include a visible label, use `ariaLabel` instead.
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * Specifies an ARIA label for the radio button group. This sets the
   * radio button group's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the radio button group includes a visible label, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Indicates whether to disable the input.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    const newDisabledState = SkyFormsUtility.coerceBooleanProperty(value);
    if (this.#_disabled !== newDisabledState) {
      this.#_disabled = newDisabledState;
      this.#updateRadioButtonDisabled();
    }
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  /**
   * Specifies a name for the collection of radio buttons that the component groups together.
   * This property overwrites the deprecated `name` property on individual `sky-radio` elements,
   * and it is required unless the `name` property is set on individual `sky-radio` elements.
   * @required
   */
  @Input()
  public set name(value: string | undefined) {
    if (value) {
      this.#_name = value;
    } else {
      this.#_name = this.#defaultName;
    }
    this.#updateRadioButtonNames();
  }
  public get name(): string {
    return this.#_name;
  }

  /**
   * Indicates whether the input is required for form validation.
   * When you set this property to `true`, the component adds `aria-required` and `required`
   * attributes to the input element so that forms display an invalid state until the input element
   * is complete.
   * @default false
   */
  @Input()
  public required: boolean | undefined = false;

  /**
   * Specifies the value of the radio button to select by default when the group loads.
   * The value corresponds to the `value` property of an individual `sky-radio` element within the
   * group.
   */
  // TODO: Look into more strongly typing in a breaking change
  @Input()
  public set value(value: any) {
    const isNewValue = value !== this.#controlValue;

    /* istanbul ignore else */
    if (isNewValue) {
      this.#controlValue = value;
      this.#onChange(value);
      this.#updateCheckedRadioFromValue();
    }
  }

  /**
   * Specifies an index for all the radio buttons in the group. If the index is not defined,
   * the indices for individual radio buttons are set to their positions on load.
   * This property supports accessibility by placing focus on the currently selected radio
   * button. If no radio button is selected, it places focus on the first or last button
   * depending on how users navigate to the radio button group.
   */
  @Input()
  public set tabIndex(value: number | undefined) {
    if (this.#_tabIndex !== value) {
      this.#_tabIndex = value;
      this.#updateRadioButtonTabIndexes();
    }
  }
  public get tabIndex(): number | undefined {
    return this.#_tabIndex;
  }

  /**
   * Our radio components are usually implemented using an unordered list. This is an
   * accessibility violation because the unordered list has an implicit role which
   * interrupts the 'radiogroup' and 'radio' relationship. To correct this, we can set the
   * radio group's 'aria-owns' attribute to a space-separated list of radio IDs.
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/radio_role
   */
  public ariaOwns: string | undefined;

  @ContentChildren(SkyRadioComponent, { descendants: true })
  public radios: QueryList<SkyRadioComponent> | undefined;

  #controlValue: any;

  #defaultName = `sky-radio-group-${nextUniqueId++}`;

  #ngUnsubscribe = new Subject<void>();

  #_disabled = false;

  #_name = '';

  #_tabIndex: number | undefined;

  #changeDetector: ChangeDetectorRef;
  #radioGroupIdSvc: SkyRadioGroupIdService;
  #ngControl: NgControl | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    radioGroupIdSvc: SkyRadioGroupIdService,
    @Self() @Optional() ngControl: NgControl
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
    this.#changeDetector = changeDetector;
    this.#radioGroupIdSvc = radioGroupIdSvc;
    this.#ngControl = ngControl;
    this.name = this.#defaultName;

    this.#radioGroupIdSvc.radioIds
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((ids) => {
        this.ariaOwns = ids.join(' ') || undefined;
        this.#changeDetector.markForCheck();
      });
  }

  public ngAfterContentInit(): void {
    // Let child radio components render before updating.
    setTimeout(() => {
      this.#resetRadioButtons();
    });

    // Watch for radio selections.
    this.watchForSelections();

    /* istanbul ignore else */
    if (this.radios) {
      this.radios.changes.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
        // Wait for child radio components to finish any rendering updates.
        setTimeout(() => {
          this.#resetRadioButtons();
        });

        // Subscribe to the new radio buttons
        this.watchForSelections();
      });
    }
  }

  public ngAfterViewInit(): void {
    if (this.#ngControl) {
      // Backwards compatibility support for anyone still using Validators.Required.
      this.required =
        this.required || SkyFormsUtility.hasRequiredValidation(this.#ngControl);

      // Avoid an ExpressionChangedAfterItHasBeenCheckedError.
      this.#changeDetector.detectChanges();
    }
  }

  public watchForSelections() {
    /* istanbul ignore else */
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.change
          .pipe(takeUntil(this.#ngUnsubscribe))
          .subscribe((change: SkyRadioChange) => {
            this.#onTouched();
            this.value = change.value;
          });
        radio.blur.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
          this.#onTouched();
          this.#changeDetector.markForCheck();
        });
      });
    }
  }

  public ngOnDestroy() {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public writeValue(value: unknown): void {
    const isNewValue = value !== this.#controlValue;

    /* istanbul ignore else */
    if (isNewValue) {
      this.#controlValue = value;
      this.#updateCheckedRadioFromValue();
    }
  }

  /**
   * @internal
   * Indicates whether to disable the control. Implemented as a part of ControlValueAccessor.
   */
  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onChange: (value: any) => void = () => {};

  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  #onTouched: () => any = () => {};

  #updateRadioButtonDisabled(): void {
    if (this.radios) {
      this.radios.forEach((radio) =>
        radio.setGroupDisabledState(this.disabled)
      );
    }
  }

  #updateRadioButtonNames(): void {
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.name = this.name;
      });
    }
  }

  #updateRadioButtonTabIndexes(): void {
    if (this.radios) {
      this.radios.forEach((radio) => {
        radio.groupTabIndex = this.tabIndex;
      });
    }
  }

  #updateCheckedRadioFromValue(): void {
    if (!this.radios) {
      return;
    }

    this.radios.forEach((radio) => {
      radio.checked = this.#controlValue === radio.value;
    });
  }

  #resetRadioButtons(): void {
    this.#updateCheckedRadioFromValue();
    this.#updateRadioButtonNames();
    this.#updateRadioButtonTabIndexes();
    this.#updateRadioButtonDisabled();
  }
}
