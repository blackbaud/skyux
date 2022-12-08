import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-checkbox-demo',
  templateUrl: './checkbox-demo.component.html',
})
export class CheckboxDemoComponent {
  public myForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.myForm = this.formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
      text: new UntypedFormControl(false),
    });
  }

  public onSubmit(): void {
    console.log(this.myForm.value);
  }
}
