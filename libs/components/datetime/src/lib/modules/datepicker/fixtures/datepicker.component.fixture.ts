import { Component, ViewChild } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SkyDatepickerCalendarChange } from '../datepicker-calendar-change';
import { SkyDatepickerInputDirective } from '../datepicker-input.directive';
import { SkyDatepickerComponent } from '../datepicker.component';

@Component({
  selector: 'sky-datepicker-test',
  templateUrl: './datepicker.component.fixture.html',
})
export class DatepickerTestComponent {
  public dateFormat: string;

  public isDisabled: boolean;

  public maxDate: Date;

  public minDate: Date;

  public noValidate: boolean = false;

  public showCustomDates: boolean = false;

  public showInvalidDirective = false;

  public selectedDate: any;

  public startingDay = 0;

  public strict: boolean;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker: SkyDatepickerComponent;

  public onCalendarDateRangeChange(event: SkyDatepickerCalendarChange): void {
    if (this.showCustomDates) {
      const customDates = [
        {
          date: new Date(1955, 10, 1),
          disabled: true,
        },
        {
          date: new Date(1955, 10, 15),
          disabled: false,
          keyDate: true,
          keyDateInfo: ['Just some key date information...'],
        },
        {
          date: new Date(1955, 10, 30),
          disabled: true,
          keyDate: true,
          keyDateInfo: ['This is a key date and also disabled.'],
        },
      ];

      // Bind observable to event argument and simulate async call.
      event.customDates = of(customDates).pipe(delay(2000));
    }
  }
}
