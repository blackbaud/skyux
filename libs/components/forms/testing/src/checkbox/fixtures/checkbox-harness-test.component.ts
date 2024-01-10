import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'test-checkbox-harness',
  templateUrl: './checkbox-harness-test.component.html',
})
export class CheckboxHarnessTestComponent {
  public myForm: UntypedFormGroup;
  public hideEmailLabel = false;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;

    this.myForm = this.#formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }
}
