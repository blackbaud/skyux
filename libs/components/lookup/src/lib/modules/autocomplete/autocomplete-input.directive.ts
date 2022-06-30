import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
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

import { Observable, Subject, fromEvent as observableFromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAutocompleteInputTextChange } from './types/autocomplete-input-text-change';

const SKY_AUTOCOMPLETE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true,
};

const SKY_AUTOCOMPLETE_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyAutocompleteInputDirective),
  multi: true,
};

@Directive({
  selector: 'input[skyAutocomplete], textarea[skyAutocomplete]',
  providers: [SKY_AUTOCOMPLETE_VALUE_ACCESSOR, SKY_AUTOCOMPLETE_VALIDATOR],
})
export class SkyAutocompleteInputDirective
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * Specifies the value for the `autocomplete` attribute on the form input.
   * @default "off"
   */
  @Input()
  public set autocompleteAttribute(value: string) {
    if (!value) {
      this.#_autocompleteAttribute = 'off';
    } else {
      this.#_autocompleteAttribute = value;
    }

    this.#renderer.setAttribute(
      this.#elementRef.nativeElement,
      'autocomplete',
      this.autocompleteAttribute
    );
  }

  public get autocompleteAttribute(): string {
    return this.#_autocompleteAttribute || 'off';
  }

  /**
   * Indicates whether to disable the autocomplete field.
   * @default false
   */
  @Input()
  public set disabled(value: boolean) {
    this.#_disabled = value;
    this.#renderer.setProperty(
      this.#elementRef.nativeElement,
      'disabled',
      value
    );
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public get blur(): Observable<void> {
    return this.#_blurObs;
  }

  public get displayWith(): string {
    return this.#_displayWith;
  }

  public set displayWith(value: string) {
    this.#_displayWith = value;
    this.inputTextValue = this.#getValueByKey();
  }

  public get focus(): Observable<void> {
    return this.#_focusObs;
  }

  public get inputTextValue(): string {
    return this.#elementRef.nativeElement.value;
  }

  public set inputTextValue(value: string) {
    this.#elementRef.nativeElement.value = value || '';
  }

  public get textChanges(): Observable<SkyAutocompleteInputTextChange> {
    return this.#_textChangesObs;
  }

  public get value(): any {
    return this.#_value;
  }

  public set value(value: any) {
    const isNewValue = value !== this.#_value;

    /* istanbul ignore else */
    if (isNewValue) {
      this.#_value = value;
      this.inputTextValue = this.#getValueByKey();
      this.onChange(this.#_value);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.#isFirstChange && this.#control) {
        this.#control.markAsPristine();
      }

      if (this.#isFirstChange && this.#_value) {
        this.#isFirstChange = false;
      }
    }
  }

  #blur: Subject<void>;

  #control: AbstractControl | undefined;

  #elementRef: ElementRef;

  #focus: Subject<void>;

  #isFirstChange: boolean;

  #ngUnsubscribe: Subject<void>;

  #renderer: Renderer2;

  #textChanges: Subject<SkyAutocompleteInputTextChange>;

  #_autocompleteAttribute: string | undefined;

  #_blurObs: Observable<void>;

  #_disabled: boolean;

  #_displayWith: string;

  #_focusObs: Observable<void>;

  #_textChangesObs: Observable<SkyAutocompleteInputTextChange>;

  #_value: any;

  constructor(elementRef: ElementRef, renderer: Renderer2) {
    this.#blur = new Subject<void>();
    this.#elementRef = elementRef;
    this.#focus = new Subject<void>();
    this.#isFirstChange = true;
    this.#ngUnsubscribe = new Subject<void>();
    this.#renderer = renderer;
    this.#textChanges = new Subject<SkyAutocompleteInputTextChange>();

    this.#_blurObs = this.#blur.asObservable();
    this.#_disabled = false;
    this.#_displayWith = '';
    this.#_focusObs = this.#focus.asObservable();
    this.#_textChangesObs = this.#textChanges.asObservable();
  }

  public ngOnInit() {
    const element = this.#elementRef.nativeElement;

    this.#setAttributes(this.#elementRef);

    observableFromEvent(element, 'input')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (!this.disabled) {
          this.#textChanges.next({
            value: this.#elementRef.nativeElement.value,
          });
        }
      });

    observableFromEvent(element, 'blur')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (!this.disabled) {
          this.#blur.next();
        }
      });

    observableFromEvent(element, 'focus')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        if (!this.disabled) {
          this.#focus.next();
        }
      });

    observableFromEvent(element, 'change')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        /* istanbul ignore else */
        if (!this.disabled) {
          this.#isFirstChange = false;
        }
      });
  }

  public ngOnDestroy(): void {
    this.#blur.complete();
    this.#textChanges.complete();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
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

  public restoreInputTextValueToPreviousState(): void {
    const modelValue = this.#getValueByKey();

    // If the search field contains text, make sure that the value
    // matches the selected descriptor key.
    if (this.inputTextValue !== modelValue) {
      this.inputTextValue = modelValue;
    }

    this.onTouched();
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }
    return null;
  }

  // See: https://www.w3.org/TR/wai-aria-practices/#kbd_focus_activedescendant
  public setActiveDescendant(descendantId: string | null): void {
    if (descendantId) {
      this.#renderer.setAttribute(
        this.#elementRef.nativeElement,
        'aria-activedescendant',
        descendantId
      );
    } else {
      this.#renderer.removeAttribute(
        this.#elementRef.nativeElement,
        'aria-activedescendant'
      );
    }
  }

  // Angular automatically constructs these methods.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onChange(value: any): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onTouched(): void {}
  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onValidatorChange = () => {};

  #setAttributes(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;

    this.#renderer.setAttribute(
      element,
      'autocomplete',
      this.autocompleteAttribute
    );
    this.#renderer.setAttribute(element, 'autocapitalize', 'none');
    this.#renderer.setAttribute(element, 'autocorrect', 'off');
    this.#renderer.setAttribute(element, 'spellcheck', 'false');
    this.#renderer.addClass(element, 'sky-form-control');
  }

  #getValueByKey(): string {
    return this.value ? this.value[this.displayWith] : undefined;
  }
}
