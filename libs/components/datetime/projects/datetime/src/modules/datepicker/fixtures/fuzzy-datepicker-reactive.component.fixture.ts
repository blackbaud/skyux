import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-reactive-test',
  templateUrl: './fuzzy-datepicker-reactive.component.fixture.html',
})
export class FuzzyDatepickerReactiveTestComponent implements OnInit {
  public futureDisabled: boolean;

  public dateControl: FormControl;

  public dateFormat: any;

  public datepickerForm: FormGroup;

  public initialValue: any;

  public isDisabled: boolean;

  public maxDate: any;

  public minDate: any;

  public noValidate: boolean = false;

  public startingDay = 0;

  public yearRequired: boolean;

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.dateControl = new FormControl(this.initialValue);

    this.datepickerForm = this.formBuilder.group({
      date: this.dateControl,
    });
  }
}
