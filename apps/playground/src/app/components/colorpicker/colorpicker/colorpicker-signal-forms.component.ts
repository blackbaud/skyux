import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FormField, form, required } from '@angular/forms/signals';
import { SkyColorpickerModule } from '@skyux/colorpicker';

/**
 * Spike harness for `SkyColorpickerInputDirective`'s signal-forms support
 * (blackbaud/skyux#4629). Binds one colorpicker three ways so
 * `required`/disabled/value/touched behavior can be compared across signal,
 * reactive, and template-driven forms. The directive implements only
 * `ControlValueAccessor`, so all three columns go through it (`FormField`
 * and reactive/template-driven forms all prefer a `ControlValueAccessor`
 * when one is present).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, FormsModule, ReactiveFormsModule, SkyColorpickerModule],
  styles: `
    :host {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--sky-space-inline-xl);
    }
  `,
  templateUrl: './colorpicker-signal-forms.component.html',
})
export class ColorpickerSignalFormsComponent {
  protected readonly swatches: string[] = [
    '#BD4040',
    '#617FC2',
    '#60AC68',
    '#3486BA',
    '#E87134',
    '#DA9C9C',
  ];

  // --- Signal forms ---
  protected readonly signalModel = signal({ favoriteColor: '' });
  protected readonly signalForm = form(this.signalModel, (p) => {
    required(p.favoriteColor, { message: 'A favorite color is required.' });
  });

  // --- Reactive forms ---
  protected readonly favoriteColor = new UntypedFormControl('');
  protected readonly reactiveForm = new UntypedFormGroup({
    favoriteColor: this.favoriteColor,
  });
  readonly #reactiveRequired = signal(false);
  protected readonly reactiveRequired = this.#reactiveRequired.asReadonly();

  // --- Template-driven forms ---
  protected templateDrivenColor = '';

  protected toggleReactiveRequired(): void {
    const nextRequired = !this.#reactiveRequired();

    if (nextRequired) {
      this.favoriteColor.addValidators(Validators.required);
    } else {
      this.favoriteColor.removeValidators(Validators.required);
    }
    this.favoriteColor.updateValueAndValidity();
    this.#reactiveRequired.set(nextRequired);
  }

  protected markAllTouched(): void {
    this.signalForm().markAsTouched();
    this.reactiveForm.markAllAsTouched();
  }
}
