import { Component, OnInit } from '@angular/core';
import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';

import { SkyDatepickerDate } from './datepicker-date';

/**
 * @internal
 */
@Component({
  selector: 'sky-monthpicker',
  templateUrl: 'monthpicker.component.html',
  styleUrls: ['./monthpicker.component.scss'],
})
export class SkyMonthPickerComponent implements OnInit {
  public datepicker: SkyDatepickerCalendarInnerComponent;

  public maxMode: string;

  public rows: Array<Array<SkyDatepickerDate>> = [];

  public title: string;

  public constructor(datepicker: SkyDatepickerCalendarInnerComponent) {
    this.datepicker = datepicker;
  }

  public ngOnInit(): void {
    this.datepicker.stepMonth = {
      years: 1,
    };

    this.datepicker.setRefreshViewHandler(() => {
      this.refreshMonthView();
    }, 'month');

    this.datepicker.setCompareHandler(this.compareMonth, 'month');

    this.datepicker.refreshView();

    this.datepicker.setKeydownHandler((key: string, event: KeyboardEvent) => {
      this.keydownMonths(key, event);
    }, 'month');
  }

  private compareMonth(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth());
    const d2 = new Date(date2.getFullYear(), date2.getMonth());
    return d1.getTime() - d2.getTime();
  }

  private refreshMonthView(): void {
    const months: Array<SkyDatepickerDate> = new Array(12);
    const year: number = this.datepicker.activeDate.getFullYear();
    let date: Date;

    for (let i = 0; i < 12; i++) {
      date = new Date(year, i, 1);
      date = this.datepicker.fixTimeZone(date);
      months[i] = this.datepicker.createDateObject(
        date,
        this.datepicker.formatMonth,
        false,
        this.datepicker.datepickerId + '-' + i
      );
    }

    this.title = this.datepicker.dateFilter(
      this.datepicker.activeDate,
      this.datepicker.formatMonthTitle
    );
    this.rows = this.datepicker.createCalendarRows(
      months,
      this.datepicker.monthColLimit
    );
  }

  private keydownMonths(key: string, event: KeyboardEvent) {
    let date = this.datepicker.activeDate.getMonth();

    /* istanbul ignore else */
    /* sanity check */
    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - this.datepicker.monthColLimit;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + this.datepicker.monthColLimit;
    } else if (key === 'pageup' || key === 'pagedown') {
      const year =
        this.datepicker.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1);
      this.datepicker.activeDate.setFullYear(year);
    } else if (key === 'home') {
      date = 0;
    } else if (key === 'end') {
      date = 11;
    }
    this.datepicker.activeDate.setMonth(date);
  }
}
