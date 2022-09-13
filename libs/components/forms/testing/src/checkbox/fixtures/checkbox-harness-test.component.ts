import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'test-checkbox-harness',
  templateUrl: './checkbox-harness-test.component.html',
})
export class CheckboxHarnessTestComponent {
  public myForm: FormGroup;
  public hideEmailLabel = false;

  #formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.#formBuilder = formBuilder;

    this.myForm = this.#formBuilder.group({
      email: new FormControl(false),
      phone: new FormControl(false, [Validators.required]),
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }
}
