import { Component } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyRadioGroupHeadingLevel,
  SkyRadioGroupHeadingStyle,
} from '@skyux/forms';

function validatePaymentMethod(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === 'check' ? { processingIssue: true } : null;
}

@Component({
  selector: 'test-radio-harness',
  templateUrl: './radio-harness-test.component.html',
})
export class RadioHarnessTestComponent {
  public class = '';
  public cashHintText: string | undefined;
  public headingLevel: SkyRadioGroupHeadingLevel | undefined = 3;
  public headingStyle: SkyRadioGroupHeadingStyle = 3;
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

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;

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
