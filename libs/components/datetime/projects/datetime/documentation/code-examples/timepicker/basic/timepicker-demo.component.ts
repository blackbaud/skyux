import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-timepicker-demo',
  templateUrl: './timepicker-demo.component.html',
})
export class TimepickerDemoComponent implements OnInit {
  public get timeControl(): FormControl {
    return this.formGroup.get('time') as FormControl;
  }

  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      time: new FormControl('2:45', Validators.required),
    });
  }

  public clearSelectedTime(): void {
    this.timeControl.setValue(undefined);
  }
}
