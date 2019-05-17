import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/operator/takeUntil';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyAutocompleteInputTextChange
} from './types';

// tslint:disable:no-forward-ref no-use-before-declare
const SKY_AUTOCOMPLETE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true
};

const SKY_AUTOCOMPLETE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true
};
// tslint:enable

@Directive({
  selector: 'input[skyAutocomplete], textarea[skyAutocomplete]',
  providers: [
    SKY_AUTOCOMPLETE_VALUE_ACCESSOR,
    SKY_AUTOCOMPLETE_VALIDATOR
  ]
})
export class SkyAutocompleteInputDirective implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  public get displayWith(): string {
    return this._displayWith;
  }

  public set displayWith(value: string) {
    this._displayWith = value;
    this.inputTextValue = this.getValueByKey();
  }

  public set value(value: any) {
    const isNewValue = value !== this._value;

    if (isNewValue) {
      this._value = value;
      this.inputTextValue = this.getValueByKey();
      this.onChange(this._value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.isFirstChange && this.control) {
        this.control.markAsPristine();
      }

      if (this.isFirstChange && this._value) {
        this.isFirstChange = false;
      }
    }
  }

  public get value(): any {
    return this._value;
  }

  public set inputTextValue(value: string) {
    this.elementRef.nativeElement.value = value || '';
  }

  public get inputTextValue(): string {
    return this.elementRef.nativeElement.value;
  }

  public textChanges = new EventEmitter<SkyAutocompleteInputTextChange>();
  public blur = new EventEmitter<void>();

  private isFirstChange = true;
  private ngUnsubscribe = new Subject();
  private _displayWith: string;
  private _value: any;
  private control: AbstractControl;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngOnInit() {
    const element = this.elementRef.nativeElement;

    this.setAttributes(element);

    Observable
      .fromEvent(element, 'keyup')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.textChanges.emit({
          value: this.elementRef.nativeElement.value
        });
      });

    Observable
      .fromEvent(element, 'blur')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.restoreInputTextValueToPreviousState();
        this.onTouched();
      });

      Observable
        .fromEvent(element, 'change')
        .takeUntil(this.ngUnsubscribe)
        .subscribe(() => {
          this.isFirstChange = false;
        });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (!this.control) {
      this.control = control;
    }
    return;
  }

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange(value: any): void { }
  /* istanbul ignore next */
  public onTouched(): void { }
  /* istanbul ignore next */
  public onValidatorChange = () => {};

  private setAttributes(element: any): void {
    this.renderer.setAttribute(element, 'autocomplete', 'off');
    this.renderer.setAttribute(element, 'autocapitalize', 'off');
    this.renderer.setAttribute(element, 'autocorrect', 'off');
    this.renderer.setAttribute(element, 'spellcheck', 'false');
    this.renderer.addClass(element, 'sky-form-control');
  }

  private restoreInputTextValueToPreviousState(): void {
    const modelValue = this.getValueByKey();

    // If the search field contains text, make sure that the value
    // matches the selected descriptor key.
    if (this.inputTextValue !== modelValue) {
      this.inputTextValue = modelValue;
    }

    this.blur.emit();
  }

  private getValueByKey(): string {
    return this.value ? this.value[this.displayWith] : undefined;
  }
}
