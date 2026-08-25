import {
  BooleanInput,
  NumberInput,
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewEncapsulation,
  contentChild,
  inject,
} from '@angular/core';
import {
  AbstractControlDirective,
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormField } from '@angular/forms/signals';
import {
  SkyContentInfoProvider,
  SkyIdService,
  SkyLogService,
} from '@skyux/core';

import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { skyIsAbstractControl } from '../shared/is-abstract-control';
import { skyWatchFormFieldChanges } from '../shared/watch-form-field-changes';

import { SkyInputBoxAdapterService } from './input-box-adapter.service';
import { SkyInputBoxControlDirective } from './input-box-control.directive';
import { SkyInputBoxHostService } from './input-box-host.service';
import { SkyInputBoxPopulateArgs } from './input-box-populate-args';

/**
 * A wrapper component that provides styling and accessibility to form elements.
 */
@Component({
  selector: 'sky-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  providers: [
    SkyContentInfoProvider,
    SkyInputBoxAdapterService,
    SkyInputBoxHostService,
    {
      provide: SKY_FORM_ERRORS_ENABLED,
      useValue: true,
    },
  ],
  // Note that change detection is not set to OnPush; default change detection allows the
  // invalid CSS class to be added when the content control's invalid/dirty state changes.
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyInputBoxComponent
  implements OnInit, AfterContentChecked, OnDestroy
{
  #changeRef = inject(ChangeDetectorRef);
  #inputBoxHostSvc = inject(SkyInputBoxHostService);
  #adapterService = inject(SkyInputBoxAdapterService);
  #idSvc = inject(SkyIdService);
  #elementRef = inject(ElementRef);
  #renderer = inject(Renderer2);
  #logger = inject(SkyLogService);

  /**
   * Whether to visually highlight the input box in an error state. If not specified, the input box
   * displays in an error state when either the `ngModel` or the Angular `FormControl` contains an error.
   * @default undefined
   */
  @Input()
  public hasErrors: boolean | undefined;

  /**
   * Whether to visually highlight the input box as disabled. To disable the input box's
   * input element, use the HTML `disabled` attribute or the Angular `FormControl.disabled`
   * property. If the input element is mapped to an Angular form control
   * (e.g. `formControlName`, `ngModel`, etc.), "disabled" styles are applied automatically;
   * if the input element is not associated with an Angular form control, the `disabled`
   * property on the input box must be set to `true` to visually indicate
   * the disabled state on the input box.
   * @default false
   */
  @Input()
  public disabled: boolean | undefined;

  /**
   * The text to display as the input's label and in known validation error messages. The label
   * will automatically be associated with the `input`, `select`, `textarea`, or compatible SKY UX
   * component included in the input box.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * The character limit for the input box. If users exceed the limit, the input box's form control
   * becomes invalid and the property adds [Validators.maxLength](https://angular.dev/api/forms/Validators).
   * The validation error message and screen reader announcement use `labelText`. This property also
   * displays a character count indicator in the top right with the number of characters that users enter,
   * the character limit, and a danger icon if users exceed the limit. If users are unlikely to exceed a
   * character limit, use `Validators.maxLength` directly instead with a `maxLength` attribute on the
   * input element.
   */
  @Input()
  public set characterLimit(value: NumberInput) {
    this.#_characterLimit =
      value === undefined ? undefined : coerceNumberProperty(value, undefined);

    this.#updateMaxLengthValidator();
  }

  public get characterLimit(): number | undefined {
    return this.#_characterLimit;
  }

  /**
   * Whether the input box is stacked on another input box. When specified, the appropriate
   * vertical spacing is automatically added to the input box.
   */
  @Input()
  public set stacked(value: BooleanInput) {
    this.#_stacked = coerceBooleanProperty(value);
    this.cssClass = this.#_stacked ? 'sky-form-field-stacked' : '';
  }

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the input box label. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the input box label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public set hintText(value: string | undefined) {
    this.#_hintText = value;

    this.ariaDescribedBy.next(value ? this.hintTextId : undefined);
  }

  public get hintText(): string | undefined {
    return this.#_hintText;
  }

  public hostInputTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsInsetTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsLeftTemplate: TemplateRef<unknown> | undefined;

  public formControlHasFocus = false;

  public hostIconsInsetTemplate: TemplateRef<unknown> | undefined;

  public hostIconsInsetLeftTemplate: TemplateRef<unknown> | undefined;

  protected hintTextHidden = false;

  protected hintTextScreenReaderOnly = false;

  protected hostHintText: string | undefined;

  public readonly controlId = this.#idSvc.generateId();
  public readonly labelId = this.#idSvc.generateId();
  public readonly errorId = this.#idSvc.generateId();
  public readonly hintTextId = this.#idSvc.generateId();
  public readonly ariaDescribedBy = new ReplaySubject<string | undefined>(1);

  #requiredByFormField: boolean | undefined;

  @HostBinding('class')
  public cssClass = '';

  @ContentChild(FormControlDirective)
  public formControl: FormControlDirective | undefined;

  @ContentChild(FormControlName)
  public formControlByName: FormControlName | undefined;

  @ContentChild(NgModel)
  public ngModel: NgModel | undefined;

  @ContentChild(SkyInputBoxControlDirective, {
    read: ElementRef,
  })
  public inputRef: ElementRef | undefined;

  /**
   * The signal-forms `FormField` directive bound to the content control, if any.
   * `FormField` provides a fake `NgControl` via DI (read below), which lets input box
   * derive most of its state through the existing `controlDir` accessors. This is used
   * as a fallback for state that isn't exposed through that interop control, such as the
   * field's `maxLength` metadata.
   */
  protected formField = contentChild(FormField);

  /**
   * Falls back to the `NgControl` provided by a signal-forms `FormField` directive when
   * none of `formControl`, `formControlByName`, or `ngModel` are present.
   */
  protected signalControl = contentChild(NgControl);

  protected controlDir: AbstractControlDirective | undefined;

  protected get isDisabled(): boolean {
    return !!(
      this.disabled ||
      this.controlDir?.control?.disabled ||
      this.inputRef?.nativeElement?.disabled
    );
  }

  protected get hasErrorsComputed(): boolean {
    if (this.hasErrors === undefined) {
      return this.#controlHasErrors(this.controlDir);
    }

    return this.hasErrors;
  }

  protected get required(): boolean {
    return !!(
      this.#hasRequiredValidator() ||
      this.inputRef?.nativeElement.required ||
      this.#requiredByFormField ||
      this.formField()?.state().required()
    );
  }

  /**
   * The character limit to display in the character counter. Prefers the signal-forms
   * field's `maxLength` rule (if bound with `[formField]`) over the `characterLimit` input.
   */
  protected get characterLimitComputed(): number | undefined {
    const schemaLimit = this.formField()?.state().maxLength?.();

    return schemaLimit === undefined ? this.characterLimit : schemaLimit;
  }

  protected characterCountScreenReader = 0;

  #_stacked = false;
  #_characterLimit: number | undefined;
  #_hintText: string | undefined;

  #previousInputRef: ElementRef | undefined;
  #previousMaxLengthValidator: ValidatorFn | undefined;
  #ngUnsubscribe = new Subject<void>();

  constructor() {
    // Refreshes the input box whenever a bound signal-forms field's state changes. This is
    // necessary because the `[formField]` binding lives in the consumer's template, so a
    // signal write there doesn't automatically mark this component's view for check.
    skyWatchFormFieldChanges(this.formField, this.#changeRef, (state) => {
      state.maxLength?.();
      state.value();
    });
  }

  public ngOnInit(): void {
    this.#inputBoxHostSvc.init(this);

    this.#inputBoxHostSvc.required
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((required) => {
        this.#requiredByFormField = required;
        this.#changeRef.markForCheck();
      });
  }

  public ngAfterContentChecked(): void {
    this.controlDir =
      this.formControl ||
      this.formControlByName ||
      this.ngModel ||
      this.signalControl();

    if (!this.formControlHasFocus) {
      this.characterCountScreenReader = this.controlDir?.value?.length || 0;
    }

    this.#updateInputRef();
  }

  public ngOnDestroy(): void {
    this.ariaDescribedBy.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  /**
   * Whether the input box component contains the focused element.
   * @internal
   */
  public containsElement(el: EventTarget): boolean {
    return this.#adapterService.containsElement(this.#elementRef, el);
  }

  public formControlFocusIn(): void {
    const inlineHelpEl = this.#adapterService.getInlineHelpElement(
      this.#elementRef,
    );
    if (!this.#adapterService.isFocusInElement(inlineHelpEl)) {
      this.#updateHasFocus(true);
    }
  }

  public formControlFocusOut(): void {
    this.characterCountScreenReader = this.controlDir?.value?.length || 0;
    this.#updateHasFocus(false);
  }

  public onInsetIconClick(): void {
    if (!this.isDisabled) {
      this.#adapterService.focusControl(this.#elementRef);
    }
  }

  public populate(args: SkyInputBoxPopulateArgs): void {
    this.hostInputTemplate = args.inputTemplate;
    this.hostButtonsTemplate = args.buttonsTemplate;
    this.hostButtonsLeftTemplate = args.buttonsLeftTemplate;
    this.hostButtonsInsetTemplate = args.buttonsInsetTemplate;
    this.hostIconsInsetTemplate = args.iconsInsetTemplate;
    this.hostIconsInsetLeftTemplate = args.iconsInsetLeftTemplate;
    this.#changeRef.markForCheck();
  }

  /**
   * Returns an element inside the input box.
   * This can be used to query parts of a input box
   * that was populated through the `SkyInputBoxHostService`
   * @internal
   */
  public queryPopulatedElement(query: string): HTMLElement {
    return this.#adapterService.queryElement(this.#elementRef, query);
  }

  public setHintTextHidden(hide: boolean): void {
    this.hintTextHidden = hide;
    this.#changeRef.markForCheck();
  }

  public setHostHintText(value: string | undefined): void {
    this.hostHintText = value;
    this.#changeRef.markForCheck();

    if (this.inputRef) {
      this.#adapterService.updateDescribedBy(
        this.inputRef,
        this.hintTextId,
        this.hintText ?? this.hostHintText,
      );
    }
  }

  public setHintTextScreenReaderOnly(hide: boolean): void {
    this.hintTextScreenReaderOnly = hide;
    this.#changeRef.markForCheck();
  }

  #hasRequiredValidator(): boolean {
    return !!this.controlDir?.control?.hasValidator(Validators.required);
  }

  #updateHasFocus(hasFocus: boolean): void {
    // Some components manipulate the focus of elements inside an input box programmatically,
    // which can cause an `ExpressionChangedAfterItHasBeenCheckedError` if focus was set after
    // initial change detection. Using `setTimeout()` here fixes it.
    setTimeout(() => {
      this.formControlHasFocus = hasFocus;
      this.#changeRef.markForCheck();
    });
  }

  #controlHasErrors(control: AbstractControlDirective | undefined): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  #updateInputRef(): void {
    if (!this.inputRef) {
      return;
    }

    const inputEl = this.inputRef.nativeElement as HTMLElement;

    // Check for the Angular required validator and add an aria-required attribute
    // to match. For template-driven forms, the input will have a `required` attribute
    // so the aria-required attribute is unnecessary.
    const hasRequiredValidator = this.#hasRequiredValidator();
    const ariaRequired = inputEl.ariaRequired;

    if (hasRequiredValidator && ariaRequired !== 'true') {
      inputEl.ariaRequired = 'true';
    } else if (!hasRequiredValidator && ariaRequired === 'true') {
      inputEl.ariaRequired = null;
    }

    if (this.hasErrorsComputed) {
      this.#renderer.setAttribute(inputEl, 'aria-invalid', 'true');
      this.#renderer.setAttribute(inputEl, 'aria-errormessage', this.errorId);
    } else {
      this.#renderer.removeAttribute(inputEl, 'aria-invalid');
      this.#renderer.removeAttribute(inputEl, 'aria-errormessage');
    }

    this.#adapterService.updateDescribedBy(
      this.inputRef,
      this.hintTextId,
      this.hintText ?? this.hostHintText,
    );

    if (this.inputRef !== this.#previousInputRef) {
      this.#renderer.addClass(inputEl, 'sky-form-control');
      this.#renderer.setAttribute(inputEl, 'id', this.controlId);

      this.#updateMaxLengthValidator();

      this.#previousInputRef = this.inputRef;
    }
  }

  #updateMaxLengthValidator(): void {
    const control = this.controlDir?.control;
    const formField = this.formField();

    if (formField) {
      // Signal-forms controls don't support imperative validator mutation; they own their
      // validation through the schema passed to `form()`. The character counter instead
      // reads the field's `maxLength` rule directly (see `characterLimitComputed`).
      try {
        if (
          this.characterLimit !== undefined &&
          formField.state().maxLength?.() === undefined
        ) {
          this.#logger.warn(
            'The `characterLimit` input has no effect on signal-forms ' +
              `controls. Add \`maxLength(field, ${this.characterLimit})\` to the schema function ` +
              'passed to `form()` instead.',
          );
        }
      } catch {
        // The `FormField` directive's own `field` input may not have a value yet if this
        // runs before its host binding has been processed (e.g. `characterLimit` is set
        // during the input box's initial input processing, ahead of content projection).
      }
      return;
    }

    if (!skyIsAbstractControl(control)) {
      return;
    }

    if (this.#previousMaxLengthValidator) {
      control.removeValidators(this.#previousMaxLengthValidator);
      this.#previousMaxLengthValidator = undefined;
    }

    if (this.characterLimit !== undefined) {
      this.#previousMaxLengthValidator = Validators.maxLength(
        this.characterLimit,
      );

      control.addValidators([this.#previousMaxLengthValidator]);
    }
  }
}
