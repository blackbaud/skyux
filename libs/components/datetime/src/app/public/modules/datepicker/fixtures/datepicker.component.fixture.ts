import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerInputDirective
} from '../datepicker-input.directive';

import {
  SkyDatepickerComponent
} from '../datepicker.component';

@Component({
  selector: 'datepicker-test',
  templateUrl: './datepicker.component.fixture.html'
})
export class DatepickerTestComponent {
  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker: SkyDatepickerComponent;

  public minDate: Date;

  public maxDate: Date;

  public selectedDate: any;

  public format: string = 'MM/DD/YYYY';
  public noValidate: boolean = false;
  public startingDay = 0;
  public isDisabled: boolean;
  public showInvalidDirective = false;
}
