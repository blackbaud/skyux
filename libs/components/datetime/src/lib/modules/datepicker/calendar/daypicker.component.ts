import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { Subject } from 'rxjs';

import { SkyDatepickerCustomDate } from '../datepicker-custom-date';

import { SkyDatepickerCalendarChange } from './datepicker-calendar-change';
import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDayPickerCellComponent } from './daypicker-cell.component';
import { SkyDayPickerContext } from './daypicker-context';

/**
 * Helper interface to compare date ranges.
 * @internal
 */
interface SkyDateRange {
  endDate: Date;
  startDate: Date;
}

/**
 * @internal
 */
@Component({
  imports: [SkyDayPickerCellComponent, SkyWaitModule],
  selector: 'sky-daypicker',
  templateUrl: 'daypicker.component.html',
})
export class SkyDayPickerComponent implements OnDestroy, OnInit {
  @Input()
  public set customDates(value: SkyDatepickerCustomDate[] | undefined) {
    /* istanbul ignore else */
    if (value) {
      this.#applyCustomDates(value, this.rows);
    }
  }

  @Output()
  public calendarDateRangeChange = new EventEmitter<
    SkyDatepickerCalendarChange | undefined
  >();

  @Input()
  public isWaiting: boolean | undefined = false;

  public activeDateHasChanged = false;
  public labels: any[] = [];
  public title = '';
  public rows: SkyDayPickerContext[][] = [];
  public weekNumbers: number[] = [];
  public datepicker: SkyDatepickerCalendarInnerComponent;
  public CURRENT_THEME_TEMPLATE: any;

  #daysInMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  #initialDate: number | undefined;
  #ngUnsubscribe = new Subject<void>();

  constructor(datepicker: SkyDatepickerCalendarInnerComponent) {
    this.datepicker = datepicker;
  }

  public ngOnInit(): void {
    this.datepicker.stepDay = { months: 1 };
    this.#initialDate = this.datepicker.activeDate.getDate();

    this.datepicker.setRefreshViewHandler(() => this.#refreshDayView(), 'day');

    this.datepicker.setCompareHandler(this.#compareDays, 'day');

    this.datepicker.setKeydownHandler((key: string, event: KeyboardEvent) => {
      this.#keydownDays(key, event);
    }, 'day');

    this.datepicker.refreshView();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  protected getDates(startDate: Date, n: number): Date[] {
    const dates: Date[] = new Array(n);
    let current = new Date(startDate.getTime());
    let i = 0;
    let date: Date;
    while (i < n) {
      date = new Date(current.getTime());
      date = this.datepicker.fixTimeZone(date);
      dates[i++] = date;
      current = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
      );
    }
    return dates;
  }

  #compareDays(date1: Date, date2: Date): number {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() - d2.getTime();
  }

  #refreshDayView(): string {
    const year = this.datepicker.activeDate.getFullYear();
    const month = this.datepicker.activeDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const difference = this.datepicker.startingDay - firstDayOfMonth.getDay();
    const numDisplayedFromPreviousMonth =
      difference > 0 ? 7 - difference : -difference;
    const firstDate = new Date(firstDayOfMonth.getTime());

    if (this.datepicker.activeDate.getDate() !== this.#initialDate) {
      this.activeDateHasChanged = true;
    }

    /* istanbul ignore else */
    /* sanity check */
    if (numDisplayedFromPreviousMonth > 0) {
      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    // 42 is the number of days on a six-week calendar
    const days: Date[] = this.getDates(firstDate, 42);
    const pickerDates: SkyDayPickerContext[] = [];
    for (let i = 0; i < 42; i++) {
      const _dateObject = this.datepicker.createDateObject(
        days[i],
        this.datepicker.formatDay,
        days[i].getMonth() !== month,
        this.datepicker.datepickerId + '-' + i,
      );
      pickerDates[i] = _dateObject;
    }

    this.labels = [];
    for (let j = 0; j < 7; j++) {
      this.labels[j] = {};
      this.labels[j].abbr = this.datepicker.dateFilter(
        pickerDates[j].date,
        this.datepicker.formatDayHeader,
      );
      this.labels[j].full = this.datepicker.dateFilter(
        pickerDates[j].date,
        'EEEE',
      );
    }

    const oldDateRange = this.#getDateRange(this.rows);
    this.rows = this.datepicker.createCalendarRows(pickerDates, 7);
    const newDateRange = this.#getDateRange(this.rows);

    if (!this.#dateRangeRowsAreEqual(oldDateRange, newDateRange)) {
      // Safety check
      /* istanbul ignore else */
      if (newDateRange) {
        this.calendarDateRangeChange.next({
          startDate: newDateRange.startDate,
          endDate: newDateRange.endDate,
        });
      } else {
        this.calendarDateRangeChange.next(undefined);
      }
    }

    return this.datepicker.dateFilter(
      this.datepicker.activeDate,
      this.datepicker.formatDayTitle,
    );
  }

  #keydownDays(key: string, event: KeyboardEvent): void {
    let date = this.datepicker.activeDate.getDate();
    /* istanbul ignore else */
    /* sanity check */
    if (key === 'arrowleft') {
      date = date - 1;
    } else if (key === 'arrowup') {
      date = date - 7;
    } else if (key === 'arrowright') {
      date = date + 1;
    } else if (key === 'arrowdown') {
      date = date + 7;
    } else if (key === 'pageup' || key === 'pagedown') {
      const month =
        this.datepicker.activeDate.getMonth() + (key === 'pageup' ? -1 : 1);
      this.datepicker.activeDate.setMonth(month, 1);
      date = Math.min(
        this.#getDaysInMonth(
          this.datepicker.activeDate.getFullYear(),
          this.datepicker.activeDate.getMonth(),
        ),
        date,
      );
    } else if (key === 'home') {
      date = 1;
    } else if (key === 'end') {
      date = this.#getDaysInMonth(
        this.datepicker.activeDate.getFullYear(),
        this.datepicker.activeDate.getMonth(),
      );
    }
    this.datepicker.activeDate.setDate(date);
    this.datepicker.announceDate(
      this.datepicker.activeDate,
      this.datepicker.formatDayLabel,
    );
  }

  #getDaysInMonth(year: number, month: number): number {
    return month === 1 &&
      year % 4 === 0 &&
      (year % 400 === 0 || year % 100 !== 0)
      ? 29
      : this.#daysInMonth[month];
  }

  /**
   * Applies custom date properties to the existing dates displayed in the calendar.
   */
  #applyCustomDates(
    customDates: SkyDatepickerCustomDate[],
    dateRows: SkyDayPickerContext[][],
  ): void {
    let date: SkyDayPickerContext;
    let newDate: SkyDayPickerContext;
    let dateIndex: number;

    /* istanbul ignore else */
    if (customDates && dateRows) {
      customDates.forEach((customDate) => {
        dateIndex = -1;
        dateRows.forEach((row) => {
          if (dateIndex === -1) {
            dateIndex = row.findIndex((d) => {
              return d.date.getTime() === customDate.date.getTime();
            });
            if (dateIndex > -1) {
              date = row[dateIndex];
              // Replace the date with a new instance so the display gets updated.
              newDate = {
                current: date.current,
                date: date.date,
                disabled: !!date.disabled || !!customDate.disabled,
                keyDate: !!customDate.keyDate || !!date.keyDate,
                keyDateText: customDate.keyDateText || date.keyDateText,
                label: date.label,
                secondary: date.secondary,
                selected: date.selected,
                uid: date.uid,
              };
              row[dateIndex] = newDate;
            }
          }
        });
      });
    }
  }

  #dateRangeRowsAreEqual(
    rangeA?: SkyDateRange,
    rangeB?: SkyDateRange,
  ): boolean | undefined {
    /* istanbul ignore if */
    if (!rangeA && !rangeB) {
      return true;
    } else if (rangeA && rangeB) {
      return (
        this.#compareDays(rangeA.startDate, rangeB.startDate) === 0 &&
        this.#compareDays(rangeA.endDate, rangeB.endDate) === 0
      );
    } else {
      return false;
    }
  }

  #getDateRange(rows: SkyDayPickerContext[][]): SkyDateRange | undefined {
    /* istanbul ignore else */
    if (rows && rows.length > 0) {
      return {
        startDate: rows[0][0].date,
        endDate: rows[rows.length - 1][rows[rows.length - 1].length - 1].date,
      };
    }
    return undefined;
  }
}
