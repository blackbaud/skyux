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
} from 'rxjs/Observable';

import {
  SkyRadioChange
} from './types';
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
  @Input()
  public set checked(value: boolean) {
    const newCheckedState = !!value;

    if (this._checked !== newCheckedState) {
      this._checked = newCheckedState;

      if (newCheckedState) {
        this.selectedValue = this.value;
      }
    }

    this.changeDetector.detectChanges();
  }

  public get checked(): boolean {
    return this._checked;
  }

  @Input()
  public disabled = false;

  @Input()
  public id = `sky-radio-${++nextUniqueId}`;

  @Input()
  public label: string;

  @Input()
  public labelledBy: string;

  @Input()
  public set name(value: string) {
    this._name = value;
    this.changeDetector.detectChanges();
  }

  public get name(): string {
    return this._name;
  }

  @Input()
  public tabindex = 0;

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

  @Input()
  public icon: string;

  @Input()
  public get radioType(): string {
    return this._radioType || 'info';
  }
  public set radioType(value: string) {
    if (value) {
      this._radioType = value.toLowerCase();
    }
  }

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
  private _name: string;
  private _radioType: string;
  private _selectedValue: any;
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
