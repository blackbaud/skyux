// #region imports
import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  QueryList
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  SkyRadioChange
} from './types';

import {
  SkyRadioComponent
} from './radio.component';
// #endregion

let nextUniqueId = 0;

const SKY_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-forward-ref no-use-before-declare
  useExisting: forwardRef(() => SkyRadioGroupComponent),
  multi: true
};

@Component({
  selector: 'sky-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    SKY_RADIO_GROUP_CONTROL_VALUE_ACCESSOR
  ]
})
export class SkyRadioGroupComponent implements AfterContentInit, ControlValueAccessor {
  @Input()
  public ariaLabelledBy: string;

  @Input()
  public set name(value: string) {
    this._name = value;
    this.updateRadioButtonNames();
  }
  public get name(): string {
    return this._name;
  }

  @Input()
  public set value(value: any) {
    const currentValue = this._value;
    if (currentValue !== value) {
      this._value = value;
      this.updateCheckedRadioFromValue();

      if (currentValue) {
        this.onChange(this.value);
        this.onTouched();
      }
    }
  }
  public get value(): any {
    return this._value;
  }

  @Input()
  public set tabIndex(value: number) {
    if (this._tabIndex !== value) {
      this._tabIndex = value;
      this.updateRadioButtonTabIndexes();
    }
  }
  public get tabIndex(): number {
    return this._tabIndex;
  }

  @ContentChildren(SkyRadioComponent, { descendants: true })
  private radios: QueryList<SkyRadioComponent>;

  private _name = `sky-radio-group-${nextUniqueId++}`;
  private _value: any;
  private _tabIndex: number;

  public ngAfterContentInit(): void {
    this.updateCheckedRadioFromValue();
    this.updateRadioButtonNames();
    this.updateRadioButtonTabIndexes();

    // Watch for radio selections.
    this.radios.forEach((radio) => {
      radio.change.subscribe((change: SkyRadioChange) => {
        this.writeValue(change.value);
      });
    });
  }

  public writeValue(value: any): void {
    this.value = value;
    this.updateCheckedRadioFromValue();
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /* istanbul ignore next */
  public onChange: (value: any) => void = () => {};
  /* istanbul ignore next */
  public onTouched: () => any = () => {};

  private updateRadioButtonNames(): void {
    if (this.radios) {
      this.radios.forEach(radio => {
        radio.name = this.name;
      });
    }
  }

  private updateRadioButtonTabIndexes(): void {
    if (this.radios) {
      this.radios.forEach(radio => {
        radio.groupTabIndex = this.tabIndex;
      });
    }
  }

  private updateCheckedRadioFromValue(): void {
    if (!this.radios) {
      return;
    }

    this.radios.forEach((radio) => {
      radio.checked = (this._value === radio.value);
      if (radio.checked) {
        this.value = radio.value;
      }
    });
  }
}
