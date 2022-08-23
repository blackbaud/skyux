import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'test-input-box-harness',
  templateUrl: './input-box-harness-test.component.html',
})
export class InputBoxHarnessTestComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      firstName: new FormControl('John'),
      lastName: new FormControl('Doe'),
    });
  }
}
