import { Component, ViewChild } from '@angular/core';

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-test',
  templateUrl: './fuzzy-datepicker.component.fixture.html',
  standalone: false,
})
export class FuzzyDatepickerTestComponent {
  public ariaLabel = 'This is a date field.';

  public futureDisabled: boolean | undefined;

  public dateFormat: string | undefined;

  public isDisabled: boolean | undefined;

  public maxDate: any;

  public minDate: any;

  public startAtDate: any;

  public noValidate = false;

  public selectedDate: any;

  public showInvalidDirective = false;

  public startingDay = 0;

  public yearRequired: boolean | undefined;

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective!: SkyFuzzyDatepickerInputDirective;
}
