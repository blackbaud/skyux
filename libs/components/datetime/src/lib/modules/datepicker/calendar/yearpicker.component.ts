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
  selector: 'sky-yearpicker',
  templateUrl: 'yearpicker.component.html',
})
export class SkyYearPickerComponent implements OnInit {
  public datepicker: SkyDatepickerCalendarInnerComponent;

  public rows: SkyDayPickerContext[][] = [];

  public title = '';

  constructor(datepicker: SkyDatepickerCalendarInnerComponent) {
    this.datepicker = datepicker;
  }

  public ngOnInit(): void {
    this.datepicker.stepYear = { years: this.datepicker.yearRange };

    this.datepicker.setRefreshViewHandler(
      () => this.#refreshYearView(),
      'year',
    );

    this.datepicker.setCompareHandler(this.#compareYears, 'year');

    this.datepicker.setKeydownHandler((key: string, event: KeyboardEvent) => {
      this.#keydownYears(key, event);
    }, 'year');

    this.datepicker.refreshView();
  }

  protected getStartingYear(year: number): number {
    return (
      Math.floor((year - 1) / this.datepicker.yearRange) *
        this.datepicker.yearRange +
      1
    );
  }

  #compareYears(date1: Date, date2: Date): number {
    return date1.getFullYear() - date2.getFullYear();
  }

  #refreshYearView(): string {
    const years = new Array<SkyDayPickerContext>(this.datepicker.yearRange);
    let date: Date;
    const start = this.getStartingYear(
      this.datepicker.activeDate.getFullYear(),
    );

    for (let i = 0; i < this.datepicker.yearRange; i++) {
      date = new Date(this.datepicker.activeDate);
      date.setFullYear(start + i, 0, 1);

      years[i] = this.datepicker.createDateObject(
        date,
        this.datepicker.formatYear,
        false,
        this.datepicker.datepickerId + '-' + i,
      );
    }

    const newTitle = [
      years[0].label,
      years[this.datepicker.yearRange - 1].label,
    ].join(' - ');
    this.rows = this.datepicker.createCalendarRows(
      years,
      this.datepicker.yearColLimit,
    );

    return newTitle;
  }

  #keydownYears(key: string, event: KeyboardEvent): void {
    let date = this.datepicker.activeDate.getFullYear();

    /* istanbul ignore else */
    /* sanity check */
    if (key === 'arrowleft') {
      date = date - 1;
    } else if (key === 'arrowup') {
      date = date - this.datepicker.yearColLimit;
    } else if (key === 'arrowright') {
      date = date + 1;
    } else if (key === 'arrowdown') {
      date = date + this.datepicker.yearColLimit;
    } else if (key === 'pageup' || key === 'pagedown') {
      date += (key === 'pageup' ? -1 : 1) * this.datepicker.yearRange;
    } else if (key === 'home') {
      date = this.getStartingYear(this.datepicker.activeDate.getFullYear());
    } else if (key === 'end') {
      date =
        this.getStartingYear(this.datepicker.activeDate.getFullYear()) +
        this.datepicker.yearRange -
        1;
    }
    this.datepicker.activeDate.setFullYear(date);
    this.datepicker.announceDate(
      this.datepicker.activeDate,
      this.datepicker.formatYearLabel,
    );
  }
}
