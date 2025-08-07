import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarLabelPipe } from './datepicker-calendar-label.pipe';
import { SkyDayPickerContext } from './daypicker-context';

/**
 * @internal
 */
@Component({
  imports: [CommonModule, SkyDatepickerCalendarLabelPipe],
  selector: 'sky-monthpicker',
  templateUrl: 'monthpicker.component.html',
})
export class SkyMonthPickerComponent implements OnInit {
  public datepicker: SkyDatepickerCalendarInnerComponent;

  public rows: SkyDayPickerContext[][] = [];

  public title = '';

  constructor(datepicker: SkyDatepickerCalendarInnerComponent) {
    this.datepicker = datepicker;
  }

  public ngOnInit(): void {
    this.datepicker.stepMonth = {
      years: 1,
    };

    this.datepicker.setRefreshViewHandler(
      () => this.#refreshMonthView(),
      'month',
    );

    this.datepicker.setCompareHandler(this.#compareMonth, 'month');

    this.datepicker.refreshView();

    this.datepicker.setKeydownHandler((key: string, event: KeyboardEvent) => {
      this.#keydownMonths(key, event);
    }, 'month');
  }

  #compareMonth(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth());
    const d2 = new Date(date2.getFullYear(), date2.getMonth());
    return d1.getTime() - d2.getTime();
  }

  #refreshMonthView(): string {
    const months = new Array<SkyDayPickerContext>(12);
    const year: number = this.datepicker.activeDate.getFullYear();
    let date: Date;

    for (let i = 0; i < 12; i++) {
      date = new Date(year, i, 1);
      date = this.datepicker.fixTimeZone(date);
      months[i] = this.datepicker.createDateObject(
        date,
        this.datepicker.formatMonth,
        false,
        this.datepicker.datepickerId + '-' + i,
      );
    }

    this.rows = this.datepicker.createCalendarRows(
      months,
      this.datepicker.monthColLimit,
    );

    return this.datepicker.dateFilter(
      this.datepicker.activeDate,
      this.datepicker.formatMonthTitle,
    );
  }

  #keydownMonths(key: string, event: KeyboardEvent): void {
    let date = this.datepicker.activeDate.getMonth();

    /* istanbul ignore else */
    /* sanity check */
    if (key === 'arrowleft') {
      date = date - 1;
    } else if (key === 'arrowup') {
      date = date - this.datepicker.monthColLimit;
    } else if (key === 'arrowright') {
      date = date + 1;
    } else if (key === 'arrowdown') {
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
    this.datepicker.announceDate(
      this.datepicker.activeDate,
      this.datepicker.formatMonthLabel,
    );
  }
}
