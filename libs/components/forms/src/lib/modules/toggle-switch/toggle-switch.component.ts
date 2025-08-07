import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  TemplateRef,
  booleanAttribute,
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
import { SkyIdService, SkyLogService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyToggleSwitchLabelComponent } from './toggle-switch-label.component';
import { SkyToggleSwitchChange } from './types/toggle-switch-change';

const SKY_TOGGLE_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SkyToggleSwitchComponent),
  multi: true,
};
const SKY_TOGGLE_SWITCH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SkyToggleSwitchComponent),
  multi: true,
};

@Component({
  selector: 'sky-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  providers: [
    SKY_TOGGLE_SWITCH_CONTROL_VALUE_ACCESSOR,
    SKY_TOGGLE_SWITCH_VALIDATOR,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyToggleSwitchComponent
  implements AfterContentInit, OnDestroy, ControlValueAccessor, Validator
{
  /**
   * The ARIA label for the toggle switch. This sets the `aria-label`
   * attribute to provide a text equivalent for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * Use a context-sensitive label, such as "Activate annual fundraiser" for a toggle switch that activates and deactivates an annual fundraiser. Context is especially important if multiple toggle switches are in close proximity.
   * When the `sky-toggle-switch-label` component displays a visible label, this property is only necessary if that label requires extra context.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @deprecated Use the `labelText` input instead.
   */
  @Input()
  public set ariaLabel(value: string | undefined) {
    this.#_ariaLabel = value;

    if (value !== undefined) {
      this.#logSvc.deprecated('SkyToggleSwitchComponent.ariaLabel', {
        deprecationMajorVersion: 9,
        replacementRecommendation:
          'To add an ARIA label to the toggle switch, use the `labelText` input instead',
      });
    }
  }

  public get ariaLabel(): string | undefined {
    return this.#_ariaLabel;
  }

  /**
   * Whether the toggle switch is selected.
   * @default false
   */
  @Input()
  public set checked(value: boolean | undefined) {
    const checked = !!value;
    if (checked !== this.#_checked) {
      this.#_checked = checked;
      this.#onChange(checked);

      // Do not mark the field as "dirty"
      // if the field has been initialized with a value.
      if (this.#isFirstChange && this.#control) {
        this.#control.markAsPristine();
        this.#isFirstChange = false;
      }
    }
  }

  public get checked(): boolean {
    return this.#_checked;
  }

  /**
   * Whether to disable the toggle switch on template-driven forms. Don't use this input on reactive forms because they may overwrite the input or leave the control out of sync.
   * To set the disabled state on reactive forms, use the `FormControl` instead.
   */
  @Input()
  public disabled: boolean | undefined = false;

  /**
   * The content of the help popover. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the toggle switch. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * The tab index for the toggle switch. If not defined, the index is set to the position
   * of the toggle switch on load.
   */
  @Input()
  public tabIndex: number | undefined = 0;

  /**
   * The text to display as the toggle switch's label.
   */
  @Input()
  public labelText: string | undefined;

  /**
   * Whether to hide `labelText` from view.
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * A help key that identifies the global help content to display. When specified along with `labelText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the toggle switch label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `labelText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * Fires when the checked state of a toggle switch changes.
   */
  @Output()
  public toggleChange = new EventEmitter<SkyToggleSwitchChange>();

  public hasLabelComponent = false;
  public labelId: string;

  public enableIndicatorAnimation = false;

  @ContentChildren(SkyToggleSwitchLabelComponent)
  public labelComponents: QueryList<SkyToggleSwitchLabelComponent> | undefined;

  #control: AbstractControl | undefined;
  #isFirstChange = true;
  readonly #logSvc = inject(SkyLogService);
  #ngUnsubscribe = new Subject<void>();

  #_ariaLabel: string | undefined;
  #_checked = false;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef, idService: SkyIdService) {
    this.#changeDetector = changeDetector;
    this.labelId = idService.generateId();
  }

  public ngAfterContentInit(): void {
    /* istanbul ignore else */
    if (this.labelComponents) {
      this.hasLabelComponent = this.labelComponents.length > 0;

      this.labelComponents.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((newLabelComponents) => {
          this.hasLabelComponent = newLabelComponents.length > 0;
          // Allow the template to reload any ARIA attributes that are relying on the
          // label component existing in the DOM.
          this.#changeDetector.markForCheck();
        });
    }

    // Wait for the view to render before applying animation effects.
    // (Some browsers, such as Firefox, apply the animation too early.)
    setTimeout(() => {
      this.enableIndicatorAnimation = true;
    });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public writeValue(value: boolean): void {
    this.checked = !!value;
    this.#changeDetector.markForCheck();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.#control) {
      this.#control = control;
    }

    return null;
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.#onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.#onTouched = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.#changeDetector.markForCheck();
  }

  public onButtonClick(event: any): void {
    event.stopPropagation();
    this.#toggleChecked();
    this.#emitChangeEvent();
  }

  public onButtonBlur(): void {
    this.#onTouched();
  }

  /* istanbul ignore next */
  #onTouched: () => any = () => {};
  /* istanbul ignore next */
  #onChange: (value: any) => void = () => {};

  #emitChangeEvent(): void {
    this.#onChange(this.#_checked);
    this.toggleChange.emit({
      checked: this.#_checked,
    });
  }

  #toggleChecked(): void {
    this.checked = !this.checked;
  }
}
