import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyDatepickerInputDirective } from '../datepicker-input.directive';
import { SkyDatepickerComponent } from '../datepicker.component';

@Component({
  selector: 'sky-datepicker-reactive-test',
  templateUrl: './datepicker-reactive.component.fixture.html',
})
export class DatepickerReactiveTestComponent implements OnInit {
  public datepickerForm: UntypedFormGroup;

  public dateControl: UntypedFormControl;

  public dateFormat: string;

  public disableFormOnCreation = false;

  public initialValue: Date | string;

  public isDisabled: boolean;

  public maxDate: Date;

  public minDate: Date;

  public noValidate = false;

  public startingDay = 0;

  public strict: boolean;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker: SkyDatepickerComponent;

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit() {
    this.dateControl = new UntypedFormControl(this.initialValue);

    this.datepickerForm = this.formBuilder.group({
      date: this.dateControl,
    });
    if (this.disableFormOnCreation) {
      this.datepickerForm.disable();
    }
  }
}
