import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyDatepickerComponent } from '../datepicker.component';

import { SkyDatepickerInputDirective } from '../datepicker-input.directive';

@Component({
  selector: 'sky-datepicker-reactive-test',
  templateUrl: './datepicker-reactive.component.fixture.html',
})
export class DatepickerReactiveTestComponent implements OnInit {
  public datepickerForm: FormGroup;

  public dateControl: FormControl;

  public dateFormat: string;

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

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit() {
    this.dateControl = new FormControl(this.initialValue);

    this.datepickerForm = this.formBuilder.group({
      date: this.dateControl,
    });
  }
}
