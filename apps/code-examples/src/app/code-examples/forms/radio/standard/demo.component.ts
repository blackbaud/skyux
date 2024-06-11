import { CommonModule } from '@angular/common';
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

interface Item {
  name: string;
  value: string;
  disabled?: boolean;
  hintText?: string;
  helpContent?: string;
}

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SkyRadioModule],
})
export class DemoComponent {
  protected formGroup: FormGroup<{ paymentMethod: FormControl<string | null> }>;
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

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.paymentMethod = this.#formBuilder.control(
      this.paymentOptions[0].name,
      {
        validators: this.#validatePaymentMethod,
      },
    );
    this.formGroup = inject(FormBuilder).group({
      paymentMethod: this.paymentMethod,
    });
  }

  #validatePaymentMethod(control: AbstractControl): ValidationErrors | null {
    if (control.value === 'check') {
      return { processingIssue: true };
    }
    return null;
  }
}
