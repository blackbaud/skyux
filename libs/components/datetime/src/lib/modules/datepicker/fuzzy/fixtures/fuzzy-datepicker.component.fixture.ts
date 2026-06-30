import { Component, ViewChild, input, model } from '@angular/core';

import { SkyFuzzyDatepickerInputDirective } from '../datepicker-input-fuzzy.directive';

@Component({
  selector: 'sky-fuzzy-datepicker-test',
  templateUrl: './fuzzy-datepicker.component.fixture.html',
  standalone: false,
})
export class FuzzyDatepickerTestComponent {
  public ariaLabel = input('This is a date field.');

  public futureDisabled = input<boolean | undefined>(undefined);

  public dateFormat = input<string | undefined>(undefined);

  public isDisabled = input<boolean | undefined>(undefined);

  public maxDate = input<any>(undefined);

  public minDate = input<any>(undefined);

  public startAtDate = input<any>(undefined);

  public noValidate = input(false);

  public selectedDate = model<any>(undefined);

  public showInvalidDirective = input(false);

  public startingDay = input(0);

  public yearRequired = input<boolean | undefined>(undefined);

  @ViewChild(SkyFuzzyDatepickerInputDirective)
  public inputDirective!: SkyFuzzyDatepickerInputDirective;
}
