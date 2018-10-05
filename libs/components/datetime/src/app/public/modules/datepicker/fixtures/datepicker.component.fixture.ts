import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerInputDirective
} from '../datepicker-input.directive';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './datepicker.component.fixture.html'
})
export class DatepickerTestComponent {

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  public minDate: Date;

  public maxDate: Date;

  public selectedDate: any;

  public format: string = 'MM/DD/YYYY';
  public noValidate: boolean = false;
  public startingDay = 0;
  public isDisabled: boolean;
}
