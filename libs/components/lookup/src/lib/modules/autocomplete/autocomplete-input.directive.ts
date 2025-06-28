import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  forwardRef,
  inject,
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
  standalone: false,
})
export class SkyAutocompleteInputDirective
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * The value for the `autocomplete` attribute on the form input.
   * @default "off"
   * @deprecated SKY UX only supports browser autofill on components where the direct input matches the return value. This input may not behave as expected due to the dropdown selection interaction.
   */
  @Input()
  public set autocompleteAttribute(value: string | undefined) {
    if (!value) {
      this.#_autocompleteAttribute = 'off';
    } else {
      this.#_autocompleteAttribute = value;
    }

    this.#renderer.setAttribute(
      this.#elementRef.nativeElement,
      'autocomplete',
      this.#_autocompleteAttribute,
    );
  }

  public get autocompleteAttribute(): string {
    return this.#_autocompleteAttribute || 'off';
  }

  /**
   * Whether to disable the autocomplete field on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = value ?? false;
    this.#renderer.setProperty(
      this.#elementRef.nativeElement,
      'disabled',
      value,
    );
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public get blur(): Observable<void> {
    return this.#blurObs;
  }

  public get displayWith(): string {
    return this.#_displayWith;
  }

  public set displayWith(value: string) {
    this.#_displayWith = value;
    this.inputTextValue = this.#getValueByKey();
  }

  public get focus(): Observable<void> {
    return this.#focusObs;
  }

  public get inputTextValue(): string {
    return this.#elementRef.nativeElement.value;
  }

  public set inputTextValue(value: string) {
    this.#elementRef.nativeElement.value = value || '';
  }

  public get textChanges(): Observable<SkyAutocompleteInputTextChange> {
    return this.#textChangesObs;
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

  #blurObs: Observable<void>;

  #control: AbstractControl | undefined;

  readonly #elementRef = inject(ElementRef);

  #focus: Subject<void>;

  #focusObs: Observable<void>;

  #isFirstChange = true;

  #ngUnsubscribe = new Subject<void>();

  readonly #renderer = inject(Renderer2);

  #textChanges: Subject<SkyAutocompleteInputTextChange>;

  #textChangesObs: Observable<SkyAutocompleteInputTextChange>;

  #_autocompleteAttribute: string | undefined;

  #_disabled = false;

  #_displayWith = '';

  #_value: any;

  constructor() {
    this.#blur = new Subject<void>();
    this.#focus = new Subject<void>();
    this.#textChanges = new Subject<SkyAutocompleteInputTextChange>();

    this.#blurObs = this.#blur.asObservable();
    this.#focusObs = this.#focus.asObservable();
    this.#textChangesObs = this.#textChanges.asObservable();
  }

  public ngOnInit(): void {
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
        descendantId,
      );
    } else {
      this.#renderer.removeAttribute(
        this.#elementRef.nativeElement,
        'aria-activedescendant',
      );
    }
  }

  /**
   * Used to connect the input to the overlay.
   */
  public setAriaControls(overlayId: string | null): void {
    if (overlayId) {
      this.#renderer.setAttribute(
        this.#elementRef.nativeElement,
        'aria-controls',
        overlayId,
      );
    } else {
      this.#renderer.removeAttribute(
        this.#elementRef.nativeElement,
        'aria-controls',
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
  public onValidatorChange = (): void => {};

  #setAttributes(elementRef: ElementRef): void {
    const element = elementRef.nativeElement;

    this.#renderer.setAttribute(
      element,
      'autocomplete',
      this.autocompleteAttribute,
    );
    this.#renderer.setAttribute(element, 'autocapitalize', 'none');
    this.#renderer.setAttribute(element, 'autocorrect', 'off');
    this.#renderer.setAttribute(element, 'spellcheck', 'false');
    this.#renderer.addClass(element, 'sky-form-control');
  }

  #getValueByKey(): string {
    return this.value ? this.value[this.displayWith] : '';
  }
}
