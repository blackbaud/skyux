import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
})
export class DatepickerDemoComponent implements OnInit {
  public myForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      myDate: new FormControl(new Date(1955, 10, 5)),
    });
  }

  public get getFuzzyDateForDisplay(): string {
    return JSON.stringify(this.myForm.get('myDate').value);
  }
}
