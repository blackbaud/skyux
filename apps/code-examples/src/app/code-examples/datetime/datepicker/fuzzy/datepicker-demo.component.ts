import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent {
  public myForm: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      myDate: new FormControl(new Date(1955, 10, 5)),
    });
  }

  public get getFuzzyDateForDisplay(): string {
    return JSON.stringify(this.myForm.get('myDate').value);
  }
}
