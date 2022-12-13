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

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      email: new UntypedFormControl(false),
      phone: new UntypedFormControl(false),
      text: new UntypedFormControl(false),
    });
  }

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }

  public onSubmit(): void {
    console.log(this.myForm.value);
  }
}
