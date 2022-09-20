import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'test-input-box-harness',
  templateUrl: './input-box-harness-test.component.html',
})
export class InputBoxHarnessTestComponent {
  public myForm: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      firstName: new UntypedFormControl('John'),
      lastName: new UntypedFormControl('Doe'),
    });
  }
}
