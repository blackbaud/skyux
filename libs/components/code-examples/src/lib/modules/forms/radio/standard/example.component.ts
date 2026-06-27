import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';

interface DemoForm {
  paymentMethod: FormControl<string | null>;
}

interface Item {
  name: string;
  value: string;
  disabled?: boolean;
  hintText?: string;
  helpContent?: string;
}

function validatePaymentMethod(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === 'check' ? { processingIssue: true } : null;
}

/**
 * @title Radio group with standard setup
 */
@Component({
  selector: 'app-forms-radio-standard-example',
  templateUrl: './example.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyRadioModule],
})
export class FormsRadioStandardExampleComponent {
  protected formGroup: FormGroup<DemoForm>;
  protected helpPopoverContent =
    "We don't charge fees for any payment method. The only exception is when credit card payments are late, which incurs a 2% fee.";
  protected helpPopoverTitle = 'Are there fees?';
  protected hintText = 'Card methods require proof of identification.';
  protected paymentMethod: FormControl<string | null>;

  protected paymentOptions: Item[] = [
    {
      name: 'Cash',
      value: 'cash',
      helpContent:
        'We accept cash at any of our locations and affiliated partners.',
    },
    { name: 'Check', value: 'check' },
    { name: 'Apple pay', value: 'apple', disabled: true },
    {
      name: 'Credit',
      value: 'credit',
      hintText: 'A 2% late fee is applied to payments made after the due date.',
    },
    { name: 'Debit', value: 'debit' },
  ];

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.paymentMethod = this.#formBuilder.control(
      this.paymentOptions[0].name,
      {
        validators: [validatePaymentMethod],
      },
    );

    this.formGroup = this.#formBuilder.group({
      paymentMethod: this.paymentMethod,
    });
  }
}
