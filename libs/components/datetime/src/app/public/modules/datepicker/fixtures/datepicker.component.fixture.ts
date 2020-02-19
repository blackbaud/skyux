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

  public dateFormat: string;

  public isDisabled: boolean;

  public maxDate: Date;

  public minDate: Date;

  public noValidate: boolean = false;

  public showInvalidDirective = false;

  public selectedDate: any;

  public startingDay = 0;

  public strict: boolean;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker: SkyDatepickerComponent;
}
