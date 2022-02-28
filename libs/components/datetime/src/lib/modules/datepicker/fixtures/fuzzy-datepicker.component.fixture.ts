import { Component, ViewChild } from '@angular/core';
import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-test',
  templateUrl: './fuzzy-datepicker.component.fixture.html',
})
export class FuzzyDatepickerTestComponent {
  public futureDisabled: boolean;

  public dateFormat: string;

  public isDisabled: boolean;

  public maxDate: any;

  public minDate: any;

  public noValidate = false;

  public selectedDate: any;

  public showInvalidDirective = false;

  public startingDay = 0;

  public yearRequired: boolean;

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective: SkyFuzzyDatepickerInputDirective;
}
