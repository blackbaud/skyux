// #region imports
import {
  AfterContentInit,
  Component,
  ContentChildren,
  forwardRef,
  Input,
  OnDestroy,
  QueryList
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import {
  Subject
} from 'rxjs/Subject';

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
export class SkyRadioGroupComponent implements AfterContentInit, ControlValueAccessor, OnDestroy {
  @Input()
  public ariaLabelledBy: string;

  @Input()
  public ariaLabel: string;

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
    // The null check is needed to address a bug in Angular 4.
    // writeValue is being called twice, first time with a phantom null value
    // See: https://github.com/angular/angular/issues/14988
    // tslint:disable-next-line:no-null-keyword
    const isNewValue = value !== this._value && value !== null;

    if (isNewValue) {
      this._value = value;
      this.onChange(this._value);
      this.updateCheckedRadioFromValue();
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

  private ngUnsubscribe = new Subject();

  private _name = `sky-radio-group-${nextUniqueId++}`;
  private _value: any;
  private _tabIndex: number;

  public ngAfterContentInit(): void {
    this.resetRadioButtons();

    // Watch for radio selections.
    this.watchForSelections();

    this.radios.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.resetRadioButtons();

        // Subscribe to the new radio buttons
        this.watchForSelections();
      });
  }

  public watchForSelections() {
    this.radios.forEach((radio) => {
      radio.change
        .takeUntil(this.ngUnsubscribe)
        .subscribe((change: SkyRadioChange) => {
          this.onTouched();
          this.writeValue(change.value);
        });
    });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
  private onChange: (value: any) => void = () => {};
  /* istanbul ignore next */
  private onTouched: () => any = () => {};

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
    });
  }

  private resetRadioButtons(): void {
    this.updateCheckedRadioFromValue();
    this.updateRadioButtonNames();
    this.updateRadioButtonTabIndexes();
  }
}
