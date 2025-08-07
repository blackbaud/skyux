import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyRadioGroupHeadingLevel,
  SkyRadioGroupHeadingStyle,
  SkyRadioModule,
} from '@skyux/forms';

function validatePaymentMethod(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === 'check' ? { processingIssue: true } : null;
}

@Component({
  selector: 'test-radio-harness',
  templateUrl: './radio-harness-test.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyRadioModule],
})
export class RadioHarnessTestComponent {
  public class = '';
  public cashHintText: string | undefined;
  public headingLevel: SkyRadioGroupHeadingLevel | undefined = 3;
  public headingStyle: SkyRadioGroupHeadingStyle = 3;
  public headingText: string | undefined = 'Payment method';
  public helpKey: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hideCashLabel = false;
  public hideCheckLabel = false;
  public hideGroupHeading = false;
  public hintText: string | undefined;
  public myForm: UntypedFormGroup;
  public paymentMethod: UntypedFormControl;
  public required = false;
  public stacked = false;

  #formBuilder = inject(UntypedFormBuilder);

  constructor() {
    this.paymentMethod = this.#formBuilder.control('cash', {
      validators: [validatePaymentMethod],
    });

    this.myForm = this.#formBuilder.group({
      paymentMethod: this.paymentMethod,
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }
}
