import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControlDirective,
  FormControlDirective,
  FormControlName,
  NgModel,
} from '@angular/forms';

import { SkyInputBoxAdapterService } from './input-box-adapter.service';
import { SkyInputBoxHostService } from './input-box-host.service';
import { SkyInputBoxPopulateArgs } from './input-box-populate-args';

/**
 * Creates a wrapper to provide styling for `input` and `label` elements. To render the
 * component correctly, include the `sky-form-control` CSS class on the `input` element
 * and the `sky-control-label` CSS class on the `label` element. To display a help button beside the label, include a help button element, such as `sky-help-inline`, in the `sky-input-box` element and a `sky-control-help` CSS class on that help button element.
 * To display an error message under the input, include a `sky-status-indicator` component with a `sky-control-error` class in the `sky-input-box` element, and use `*ngIf` to determine whether to display the error message based on the input value.
 */
@Component({
  selector: 'sky-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss'],
  providers: [SkyInputBoxAdapterService, SkyInputBoxHostService],
  // Note that change detection is not set to OnPush; default change detection allows the
  // invalid CSS class to be added when the content control's invalid/dirty state changes.
  encapsulation: ViewEncapsulation.None,
})
export class SkyInputBoxComponent implements OnInit {
  /**
   * Whether to visually highlight the input box in an error state. If not specified, the input box
   * displays in an error state when either the `ngModel` or the Angular `FormControl` contains an error.
   * @default undefined
   */
  @Input()
  public hasErrors: boolean | undefined;

  /**
   * Whether to visually highlight the input box as disabled. To disable the input box's
   * `input` element, use the HTML `disabled` attribute or the Angular `FormControl.disabled`
   * property. You must set both properties to disable an `input` element and visually indicate
   * the disabled state on the input box.
   * @default false
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    this.#_disabled = coerceBooleanProperty(value);
  }

  public get disabled(): boolean {
    return this.#_disabled;
  }

  public hostInputTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsInsetTemplate: TemplateRef<unknown> | undefined;

  public hostButtonsLeftTemplate: TemplateRef<unknown> | undefined;

  public formControlHasFocus = false;

  public hostIconsInsetTemplate: TemplateRef<unknown> | undefined;

  public hostIconsInsetLeftTemplate: TemplateRef<unknown> | undefined;

  @ContentChild(FormControlDirective)
  public formControl: FormControlDirective | undefined;

  @ContentChild(FormControlName)
  public formControlByName: FormControlName | undefined;

  @ContentChild(NgModel)
  public ngModel: NgModel | undefined;

  public get hasErrorsComputed(): boolean {
    if (this.hasErrors === undefined) {
      return !!(
        this.#controlHasErrors(this.formControl) ||
        this.#controlHasErrors(this.formControlByName) ||
        this.#controlHasErrors(this.ngModel)
      );
    }

    return this.hasErrors;
  }

  #changeRef: ChangeDetectorRef;
  #inputBoxHostSvc: SkyInputBoxHostService;
  #adapterService: SkyInputBoxAdapterService;
  #elementRef: ElementRef;
  #_disabled = false;

  constructor(
    changeRef: ChangeDetectorRef,
    inputBoxHostSvc: SkyInputBoxHostService,
    adapterService: SkyInputBoxAdapterService,
    elementRef: ElementRef
  ) {
    this.#changeRef = changeRef;
    this.#inputBoxHostSvc = inputBoxHostSvc;
    this.#adapterService = adapterService;
    this.#elementRef = elementRef;
  }

  public ngOnInit(): void {
    this.#inputBoxHostSvc.init(this);
  }

  public formControlFocusIn(): void {
    const inlineHelpEl = this.#adapterService.getInlineHelpElement(
      this.#elementRef
    );
    if (!this.#adapterService.isFocusInElement(inlineHelpEl)) {
      this.#updateHasFocus(true);
    }
  }

  public formControlFocusOut(): void {
    this.#updateHasFocus(false);
  }

  public onInsetIconClick(): void {
    if (!this.disabled) {
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

  #controlHasErrors(control: AbstractControlDirective | undefined) {
    return control && control.invalid && (control.dirty || control.touched);
  }
}
