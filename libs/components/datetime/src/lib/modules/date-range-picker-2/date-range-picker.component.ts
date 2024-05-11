/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  HostBinding,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  booleanAttribute,
  forwardRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDateRangePickerService } from './date-range-picker.service';
import { SkyDateRangeService } from './date-range.service';
import { SkyDateRangeCalculation } from './types/date-range-calculation';
import { SkyDateRangeCalculator } from './types/date-range-calculator';
import { SkyDateRangeCalculatorId } from './types/date-range-calculator-id';
import { SKY_DEFAULT_CALCULATOR_CONFIGS } from './types/date-range-default-calculator-configs';

const DEFAULT_CALCULATOR_IDS: SkyDateRangeCalculatorId[] = [
  SkyDateRangeCalculatorId.AnyTime,
  SkyDateRangeCalculatorId.Before,
  SkyDateRangeCalculatorId.After,
  SkyDateRangeCalculatorId.SpecificRange,
  SkyDateRangeCalculatorId.Yesterday,
  SkyDateRangeCalculatorId.Today,
  SkyDateRangeCalculatorId.Tomorrow,
  SkyDateRangeCalculatorId.LastWeek,
  SkyDateRangeCalculatorId.ThisWeek,
  SkyDateRangeCalculatorId.NextWeek,
  SkyDateRangeCalculatorId.LastMonth,
  SkyDateRangeCalculatorId.ThisMonth,
  SkyDateRangeCalculatorId.NextMonth,
  SkyDateRangeCalculatorId.LastQuarter,
  SkyDateRangeCalculatorId.ThisQuarter,
  SkyDateRangeCalculatorId.NextQuarter,
  SkyDateRangeCalculatorId.LastCalendarYear,
  SkyDateRangeCalculatorId.ThisCalendarYear,
  SkyDateRangeCalculatorId.NextCalendarYear,
  SkyDateRangeCalculatorId.LastFiscalYear,
  SkyDateRangeCalculatorId.ThisFiscalYear,
  SkyDateRangeCalculatorId.NextFiscalYear,
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    SkyDatetimeResourcesModule,
    SkyInputBoxModule,
  ],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SkyDateRangePickerComponent,
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SkyDateRangePickerComponent,
      multi: true,
    },
  ],
  selector: 'sky-date-range-picker',
  standalone: true,
  styles: `
    :host {
      display: block;
    }
  `,
  template: `<div class="sky-date-range-picker" (focusout)="onBlur()">
    <div class="sky-date-range-picker-form-group">
      <sky-input-box
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelText]="
          label || ('skyux_date_range_picker_default_label' | skyLibResources)
        "
      >
        <select
          [disabled]="disabled"
          [required]="isRequired()"
          [(ngModel)]="value.calculatorId"
          (change)="onCalculatorSelected()"
        >
          <option
            *ngFor="let calculator of calculators"
            [value]="calculator.calculatorId"
          >
            <ng-container
              *ngIf="
                calculator.shortDescriptionResourceKey;
                else shortDescription
              "
              >{{
                calculator.shortDescriptionResourceKey | skyLibResources
              }}</ng-container
            >
            <ng-template #shortDescription>{{
              calculator.shortDescription
            }}</ng-template>
          </option>
        </select>
      </sky-input-box>
    </div>
    <div class="sky-date-range-picker-form-group"></div>
    <div class="sky-date-range-picker-form-group"></div>
  </div>`,
})
export class SkyDateRangePickerComponent
  implements AfterViewInit, ControlValueAccessor, OnInit, Validator
{
  @Input()
  public set calculatorIds(value: SkyDateRangeCalculatorId[] | undefined) {
    this.#_calculatorIds = value ?? DEFAULT_CALCULATOR_IDS;
    // this.calculators = this.#dateRangeSvc.filterCalculators(
    //   this.#_calculatorIds,
    // );
    // this.value = this.#getDefaultValue();
    // this.#changeDetector.markForCheck();
  }

  public get calculatorIds(): SkyDateRangeCalculatorId[] {
    return this.#_calculatorIds;
  }

  @Input({ transform: booleanAttribute })
  public disabled = false;

  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  @Input()
  public helpPopoverTitle: string | undefined;

  @Input()
  public hintText: string | undefined;

  @Input()
  public label: string | undefined;

  @Input({ transform: booleanAttribute })
  public required = false;

  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-lg')
  public stacked = false;

  protected set value(value: SkyDateRangeCalculation | null | undefined) {
    this.#_value = value ?? this.#getDefaultValue();

    if (!value) {
      this.#setDefaultValue();
    }
  }

  protected get value(): SkyDateRangeCalculation {
    return this.#_value;
  }

  protected calculators: SkyDateRangeCalculator[] = [];

  #_calculatorIds = DEFAULT_CALCULATOR_IDS;
  #_value: SkyDateRangeCalculation;
  #isInitialized = false;
  #notifyChange: ((_: SkyDateRangeCalculation) => void) | undefined;
  #notifyTouched: (() => void) | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dateRangeSvc = inject(SkyDateRangePickerService);
  // readonly #injector = inject(Injector);

  #control: AbstractControl | undefined;
  // #ngControl: NgControl | null | undefined;

  constructor() {
    // this.#ngControl = this.#injector.get(NgControl, undefined, {
    //   optional: true,
    //   self: true,
    // });

    // if (this.#ngControl) {
    //   this.#ngControl.valueAccessor = this;
    // }

    this.#_value = this.#getDefaultValue();
    this.calculators = this.#dateRangeSvc.calculators;
  }

  public ngOnInit(): void {
    console.log('ngOnInit()');
    // We need the date input to provide itself as a `ControlValueAccessor` and a `Validator`, while
    // injecting its `NgControl` so that the error state is handled correctly. This introduces a
    // circular dependency, because both `ControlValueAccessor` and `Validator` depend on the input
    // itself. Usually we can work around it for the CVA, but there's no API to do it for the
    // validator. We work around it here by injecting the `NgControl` in `ngOnInit`, after
    // everything has been resolved.
    // @see: https://github.com/angular/components/blob/02c668cdb196bec0a1ce09e0ab817fd371a4fb8b/src/material/datepicker/date-range-input-parts.ts#L23
    // const ngControl = this.#injector.get(NgControl, null, {
    //   optional: true,
    //   self: true,
    // });

    // console.log('ngOnInit ngControl.control', ngControl?.control);

    // if (ngControl) {
    //   this.#ngControl = ngControl;
    //   // this._errorStateTracker.ngControl = ngControl;
    // }

    // TODO, move, because this won't work here.
    // if (this.#ngControl?.control) {
    //   // TODO: Instead of doing this, write a custom validator instead.
    //   // See: https://angular.io/api/forms/NG_VALIDATORS
    //   // this.#ngControl.control.addValidators(this.validate);

    //   if (!this.#ngControl.control.value) {
    //     this.#ngControl.control.setValue(this.value, { emitEvent: false });
    //   }

    //   this.#ngControl.control.statusChanges.subscribe(() => {
    //     this.#changeDetector.markForCheck();
    //   });
    // }
  }

  public ngAfterViewInit(): void {
    this.#isInitialized = true;

    this.#control?.statusChanges.subscribe(() => {
      this.#changeDetector.markForCheck();
    });
  }

  // TODO: how to set the default value of the control on init?
  // Should we be doing that?
  // What if we set the default only if it's undefined when the form is submitted?
  // How is Paul doing it for UIModel?
  // writeValue is getting called twice when the value changes. Why?

  public registerOnChange(fn: (_: unknown) => void): void {
    this.#notifyChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#notifyTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    console.log('validate:', control);
    this.#control ||= control;

    // Set a default value on init.
    if (!this.#isInitialized && !control.value) {
      this.#setDefaultValue();
      return null;
    }

    return null;
  }

  public writeValue(value: SkyDateRangeCalculation | undefined): void {
    console.log('writeValue control', this.#control);
    this.value = value;

    this.#changeDetector.markForCheck();
  }

  protected isRequired(): boolean {
    return !!(
      this.required || this.#control?.hasValidator(Validators.required)
    );
  }

  protected onBlur(): void {
    this.#notifyTouched?.();
  }

  protected onCalculatorSelected(): void {
    const value = this.value;
    value.calculatorId = +value.calculatorId;

    this.#notifyChange?.(value);
  }

  #getDefaultValue(): SkyDateRangeCalculation {
    return {
      calculatorId: this.calculatorIds[0],
    };
  }

  #setDefaultValue(): void {
    this.#control?.setValue(this.value, { emitEvent: false, onlySelf: true });
  }

  // async #updateCalculators(): Promise<void> {
  //   this.calculators = await this.#dateRangeSvc.getCalculators(
  //     this.calculatorIds,
  //   );

  //   this.#changeDetector.markForCheck();
  // }
}
