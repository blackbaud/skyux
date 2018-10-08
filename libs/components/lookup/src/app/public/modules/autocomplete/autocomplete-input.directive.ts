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
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import {
  SkyAutocompleteInputTextChange
} from './types';

@Directive({
  selector: 'input[skyAutocomplete], textarea[skyAutocomplete]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable-next-line:no-forward-ref */
      useExisting: forwardRef(() => SkyAutocompleteInputDirective),
      multi: true
    }
  ]
})
export class SkyAutocompleteInputDirective
  implements OnInit, OnDestroy, ControlValueAccessor {

  public get displayWith(): string {
    return this._displayWith;
  }

  public set displayWith(value: string) {
    this._displayWith = value;
    this.updateTextValue();
  }

  public get value() {
    return this._value;
  }

  public set value(value: any) {
    this._value = value;
    this.updateTextValue();
    this.onChange(this.value);
    this.onTouched();
  }

  public set textValue(value: string) {
    this.elementRef.nativeElement.value = value || '';
  }

  public textChanges = new EventEmitter<SkyAutocompleteInputTextChange>();
  public blur = new EventEmitter<void>();

  private ngUnsubscribe = new Subject();
  private _displayWith: string;
  private _value: any;

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
        this.checkValues();
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

  // Angular automatically constructs these methods.
  /* istanbul ignore next */
  public onChange(value: any): void { }
  /* istanbul ignore next */
  public onTouched(): void { }

  private setAttributes(element: any): void {
    this.renderer.setAttribute(element, 'autocomplete', 'off');
    this.renderer.setAttribute(element, 'autocapitalize', 'off');
    this.renderer.setAttribute(element, 'autocorrect', 'off');
    this.renderer.setAttribute(element, 'spellcheck', 'false');
    this.renderer.addClass(element, 'sky-form-control');
  }

  private checkValues(): void {
    const text = this.elementRef.nativeElement.value;
    const displayValue = this.value ? this.value[this.displayWith] : undefined;

    // If the search field contains text, make sure that the value
    // matches the selected descriptor key.
    if (text && displayValue) {
      if (text !== displayValue) {
        this.textValue = displayValue;
      }
    } else {
      // The search field is empty (or doesn't have a selected item),
      // so clear out the selected value.
      this.value = undefined;
    }

    this.blur.emit();
  }

  private updateTextValue() {
    this.textValue = this.value ? this.value[this.displayWith] : undefined;
  }
}
