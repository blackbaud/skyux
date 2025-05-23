import { Component, ViewChild } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SkyDatepickerCalendarChange } from '../calendar/datepicker-calendar-change';
import { SkyDatepickerInputDirective } from '../datepicker-input.directive';
import { SkyDatepickerComponent } from '../datepicker.component';

@Component({
  selector: 'sky-datepicker-test',
  templateUrl: './datepicker.component.fixture.html',
  standalone: false,
})
export class DatepickerTestComponent {
  public dateFormat: string | undefined;

  public isDisabled: boolean | undefined;

  public maxDate: Date | undefined;

  public minDate: Date | undefined;

  public startAtDate: Date | undefined;

  public noValidate = false;

  public showCustomDates = false;

  public showInvalidDirective = false;

  public selectedDate: any;

  public startingDay = 0;

  public strict: boolean | undefined;

  @ViewChild(SkyDatepickerInputDirective)
  public inputDirective!: SkyDatepickerInputDirective;

  @ViewChild(SkyDatepickerComponent)
  public datepicker!: SkyDatepickerComponent;

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
