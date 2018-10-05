import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { SkyDateFormatter } from './date-formatter';

import {
  SkyDatepickerDate
} from './datepicker-date';

let nextDatepickerId = 0;

@Component({
  selector: 'sky-datepicker-inner',
  templateUrl: './datepicker-calendar-inner.component.html',
  styleUrls: ['./datepicker-calendar-inner.component.scss']
})
export class SkyDatepickerCalendarInnerComponent implements OnInit, OnChanges {
  @Input()
  public startingDay: number;

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  @Input()
  public selectedDate: Date;

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(undefined);

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  public activeDate: Date;

  public minMode: string = 'day';
  public maxMode: string = 'year';
  public monthColLimit: number = 3;
  public yearColLimit: number = 5;
  public datepickerMode: string = 'day';
  public yearRange: number = 20;

  public formatDay: string = 'DD';
  public formatMonth: string = 'MMMM';
  public formatYear: string = 'YYYY';
  public formatDayHeader: string = 'dd';
  public formatDayTitle: string = 'MMMM YYYY';
  public formatMonthTitle: string = 'YYYY';

  public datepickerId: string = `sky-datepicker-${++nextDatepickerId}`;

  public stepDay: any = {};
  public stepMonth: any = {};
  public stepYear: any = {};

  protected modes: string[] = ['day', 'month', 'year'];
  protected dateFormatter: SkyDateFormatter = new SkyDateFormatter();
  protected activeDateId: string;

  public refreshViewHandlerDay: Function;
  public compareHandlerDay: Function;
  public refreshViewHandlerMonth: Function;
  public compareHandlerMonth: Function;
  public refreshViewHandlerYear: Function;
  public compareHandlerYear: Function;

  public handleKeydownDay: Function;
  public handleKeydownMonth: Function;
  public handleKeydownYear: Function;

  public keys: any = {
    13: 'enter',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  public ngOnInit(): void {

    if (this.selectedDate) {
      this.activeDate = new Date(this.selectedDate);
    } else {
      this.activeDate = new Date();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.refreshView();
  }

  public setCompareHandler(handler: Function, type: string): void {
    if (type === 'day') {
      this.compareHandlerDay = handler;
    }

    if (type === 'month') {
      this.compareHandlerMonth = handler;
    }

    if (type === 'year') {
      this.compareHandlerYear = handler;
    }
  }

  public compare(date1: Date, date2: Date) {
    if (date1 === undefined || date2 === undefined) {
      return undefined;
    }

    if (this.datepickerMode === 'day' && this.compareHandlerDay) {
      return this.compareHandlerDay(date1, date2);
    }

    if (this.datepickerMode === 'month' && this.compareHandlerMonth) {
      return this.compareHandlerMonth(date1, date2);
    }

    /* istanbul ignore else */
    /* sanity check */
    if (this.datepickerMode === 'year' && this.compareHandlerYear) {
      return this.compareHandlerYear(date1, date2);
    }

  }

  public setRefreshViewHandler(handler: Function, type: string): void {
    if (type === 'day') {
      this.refreshViewHandlerDay = handler;
    }

    if (type === 'month') {
      this.refreshViewHandlerMonth = handler;
    }

    if (type === 'year') {
      this.refreshViewHandlerYear = handler;
    }
  }

  public refreshView(): void {
    if (this.datepickerMode === 'day' && this.refreshViewHandlerDay) {
      this.refreshViewHandlerDay();
    }

    if (this.datepickerMode === 'month' && this.refreshViewHandlerMonth) {
      this.refreshViewHandlerMonth();
    }

    if (this.datepickerMode === 'year' && this.refreshViewHandlerYear) {
      this.refreshViewHandlerYear();
    }
  }

  public setKeydownHandler(handler: Function, type: string) {
    if (type === 'day') {
      this.handleKeydownDay = handler;
    }

    if (type === 'month') {
      this.handleKeydownMonth = handler;
    }

    if (type === 'year') {
      this.handleKeydownYear = handler;
    }
  }

  public handleKeydown(key: string, event: KeyboardEvent): void {
    if (this.datepickerMode === 'day' && this.handleKeydownDay) {
      this.handleKeydownDay(key, event);
    }

    if (this.datepickerMode === 'month' && this.handleKeydownMonth) {
      this.handleKeydownMonth(key, event);
    }

    if (this.datepickerMode === 'year' && this.handleKeydownYear) {
      this.handleKeydownYear(key, event);
    }
  }

  public dateFilter(date: Date, format: string): string {
    return this.dateFormatter.format(date, format);
  }

  public isActive(dateObject: any): boolean {
    if (this.compare(dateObject.date, this.activeDate) === 0) {
      this.activeDateId = dateObject.uid;
      return true;
    }

    return false;
  }

  public onKeydown(event: KeyboardEvent) {
    let key = this.keys[event.which];

    if (!key || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (key === 'enter' || key === 'space') {
      if (this.isDisabled(this.activeDate)) {
        return;
      }
      this.select(this.activeDate);
    } else if (event.ctrlKey && (key === 'up' || key === 'down')) {
      this.toggleMode(key === 'up' ? 1 : -1);
    } else {
      this.handleKeydown(key, event);
      this.refreshView();
    }
  }

  public createDateObject(
    date: Date,
    format: string,
    isSecondary: boolean,
    id: string): SkyDatepickerDate {

    let dateObject: SkyDatepickerDate = {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      label: this.dateFilter(date, format),
      selected: this.compare(date, this.selectedDate) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0,
      secondary: isSecondary,
      uid: id
    };

    return dateObject;
  }

  public createCalendarRows(
    dates: Array<SkyDatepickerDate>,
    size: number): Array<Array<SkyDatepickerDate>> {

    let rows: Array<Array<SkyDatepickerDate>> = [];
    while (dates.length > 0) {
      rows.push(dates.splice(0, size));
    }
    return rows;
  }

  /*
    This is ensures that no strangeness happens when converting a date to local time.
  */
  public fixTimeZone(date: Date): Date {
    let newDate = new Date(date);
    newDate.setFullYear(
      date.getFullYear(),
      date.getMonth(),
      date.getDate());

    return newDate;
  }

  public selectCalendar(event: Event, date: Date, closePicker: boolean = false) {
    if (!closePicker) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.select(date);
  }

  public select(date: Date, isManual: boolean = true): void {

    this.activeDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    /*
        Only actually select date if in minmode (day picker mode).
        Otherwise, just change the active view for the datepicker.
    */
    if (this.datepickerMode === this.minMode) {
      this.selectedDate = new Date(this.activeDate);
      if (isManual) {
        this.selectedDateChange.emit(this.selectedDate);
      }

    } else {
      this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) - 1];
      this.calendarModeChange.emit(this.datepickerMode);
    }

    this.refreshView();
  }

  public moveCalendar(event: Event, direction: number) {
    event.preventDefault();
    event.stopPropagation();
    this.move(direction);
  }

  public move(direction: number): void {

    let expectedStep: any;
    if (this.datepickerMode === 'day') {
      expectedStep = this.stepDay;
    }

    if (this.datepickerMode === 'month') {
      expectedStep = this.stepMonth;
    }

    if (this.datepickerMode === 'year') {
      expectedStep = this.stepYear;
    }

    /* istanbul ignore else */
    /* sanity check */
    if (expectedStep) {
      let year = this.activeDate.getFullYear() + (direction * (expectedStep.years || 0));
      let month = this.activeDate.getMonth() + (direction * (expectedStep.months || 0));

      this.activeDate = new Date(year, month, 1);

      this.refreshView();
    }
  }

  public toggleModeCalendar(event: Event, direction: number) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleMode(direction);
  }

  public toggleMode(direction: number): void {
    direction = direction || 1;

    /* istanbul ignore else */
    /* sanity check */
    if (!(direction === 1 && this.datepickerMode === this.maxMode) &&
      !(this.datepickerMode === this.minMode && direction === -1)) {
      this.datepickerMode = this.modes[this.modes.indexOf(this.datepickerMode) + direction];
      this.calendarModeChange.emit(this.datepickerMode);
      this.refreshView();
    }
  }

  protected isDisabled(date: Date): boolean {

    return ((this.minDate && this.compare(date, this.minDate) < 0)
      || (this.maxDate && this.compare(date, this.maxDate) > 0));
  }
}
