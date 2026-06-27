import { Component, inject, model } from '@angular/core';
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
  public class = model('');
  public cashHintText = model<string | undefined>(undefined);
  public headingLevel = model<SkyRadioGroupHeadingLevel | undefined>(3);
  public headingStyle = model<SkyRadioGroupHeadingStyle>(3);
  public headingText = model<string | undefined>('Payment method');
  public helpKey = model<string | undefined>(undefined);
  public helpPopoverContent = model<string | undefined>(undefined);
  public helpPopoverTitle = model<string | undefined>(undefined);
  public hideCashLabel = model(false);
  public hideCheckLabel = model(false);
  public hideGroupHeading = model(false);
  public hintText = model<string | undefined>(undefined);
  public myForm: UntypedFormGroup;
  public paymentMethod: UntypedFormControl;
  public required = model(false);
  public stacked = model(false);

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
