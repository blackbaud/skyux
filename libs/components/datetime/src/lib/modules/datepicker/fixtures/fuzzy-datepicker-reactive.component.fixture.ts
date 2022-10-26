import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-reactive-test',
  templateUrl: './fuzzy-datepicker-reactive.component.fixture.html',
})
export class FuzzyDatepickerReactiveTestComponent implements OnInit {
  public futureDisabled: boolean;

  public dateControl: UntypedFormControl;

  public dateFormat: any;

  public datepickerForm: UntypedFormGroup;

  public initialValue: any;

  public isDisabled: boolean;

  public maxDate: any;

  public minDate: any;

  public noValidate = false;

  public startingDay = 0;

  public yearRequired: boolean;

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.dateControl = new UntypedFormControl(this.initialValue);

    this.datepickerForm = this.#formBuilder.group({
      date: this.dateControl,
    });
  }
}
