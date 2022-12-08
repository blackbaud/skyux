import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent {
  public myForm: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.myForm = this.formBuilder.group({
      myDate: new UntypedFormControl(new Date(1999, 10, 5)),
    });
  }
}
