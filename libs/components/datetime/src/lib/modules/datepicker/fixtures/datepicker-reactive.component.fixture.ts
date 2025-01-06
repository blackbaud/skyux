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
  standalone: false,
})
export class DatepickerReactiveTestComponent implements OnInit {
  public datepickerForm: UntypedFormGroup | undefined;

  public dateControl!: UntypedFormControl;

  public dateFormat: string | undefined;

  public disableFormOnCreation = false;

  public initialValue: Date | string | undefined;

  public isDisabled: boolean | undefined;

  public maxDate: Date | undefined;

  public minDate: Date | undefined;

  public startAtDate: Date | undefined;

  public noValidate = false;

  public startingDay = 0;

  public strict: boolean | undefined;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective!: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker!: SkyDatepickerComponent;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit() {
    this.dateControl = new UntypedFormControl(this.initialValue);

    this.datepickerForm = this.#formBuilder.group({
      date: this.dateControl,
    });
    if (this.disableFormOnCreation) {
      this.datepickerForm.disable();
    }
  }
}
