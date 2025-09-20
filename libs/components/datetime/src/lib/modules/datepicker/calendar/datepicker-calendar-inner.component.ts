import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, takeUntil } from 'rxjs';

import { SkyDateFormatter } from '../date-formatter';
import { SkyDatepickerCustomDate } from '../datepicker-custom-date';

import { SkyDayPickerContext } from './daypicker-context';

type DateComparator = (date1: Date, date2: Date) => number | undefined;
type KeyboardEventHandler = (key: string, event: KeyboardEvent) => void;

let nextDatepickerId = 0;

/**
 * @internal
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, SkyIconModule, SkyThemeModule],
  selector: 'sky-datepicker-inner',
  templateUrl: './datepicker-calendar-inner.component.html',
  styleUrl: './datepicker-calendar-inner.component.scss',
})
export class SkyDatepickerCalendarInnerComponent
  implements OnDestroy, OnInit, OnChanges
{
  @Input()
  public customDates: SkyDatepickerCustomDate[] | undefined;

  @Input()
  public set startingDay(value: number | undefined) {
    this.#_startingDay = value || 0;
  }

  public get startingDay(): number {
    return this.#_startingDay;
  }

  @Input()
  public minDate: Date | undefined;

  @Input()
  public maxDate: Date | undefined;

  @Input()
  public startAtDate: Date | undefined;

  @Input()
  public set selectedDate(value: Date | undefined) {
    if (value && this.dateFormatter.dateIsValid(value)) {
      this.#_selectedDate = value;
      this.activeDate = value;
    } else {
      this.#_selectedDate = undefined;
      this.activeDate = new Date();
    }
  }

  public get selectedDate(): Date | undefined {
    return this.#_selectedDate;
  }

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(
    undefined,
  );

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  // TODO: `activeDate` is very similar to `selectedDate` and at the very least should be able to be undefined. However, this would take considerable refactoring to do and thus has been deferred.
  public activeDate = new Date();
  public activeDateId = '';

  public title = '';

  public minMode = 'day';
  public maxMode = 'year';
  public monthColLimit = 3;
  public yearColLimit = 5;
  public datepickerMode = 'day';
  public yearRange = 20;

  public formatDay = 'DD';
  public formatMonth = 'MMMM';
  public formatYear = 'YYYY';
  public formatDayHeader = 'dd';
  public formatDayTitle = 'MMMM YYYY';
  public formatMonthTitle = 'YYYY';
  public formatDayLabel = 'dddd, MMMM Do YYYY';
  public formatMonthLabel = 'MMMM YYYY';
  public formatYearLabel = 'YYYY';

  public previousLabel: string | undefined;
  public nextLabel: string | undefined;

  public datepickerId = `sky-datepicker-${++nextDatepickerId}`;

  public stepDay: any = {};
  public stepMonth: any = {};
  public stepYear: any = {};

  protected modes: string[] = ['day', 'month', 'year'];
  protected dateFormatter: SkyDateFormatter = new SkyDateFormatter();

  public refreshViewHandlerDay: (() => string) | undefined;
  public compareHandlerDay: DateComparator | undefined;
  public refreshViewHandlerMonth: (() => string) | undefined;
  public compareHandlerMonth: DateComparator | undefined;
  public refreshViewHandlerYear: (() => string) | undefined;
  public compareHandlerYear: DateComparator | undefined;

  public handleKeydownDay: KeyboardEventHandler | undefined;
  public handleKeydownMonth: KeyboardEventHandler | undefined;
  public handleKeydownYear: KeyboardEventHandler | undefined;

  public keys = [
    'enter',
    ' ',
    'spacebar',
    'pageup',
    'pagedown',
    'end',
    'home',
    'arrowleft',
    'arrowup',
    'arrowright',
    'arrowdown',
  ];

  #ngUnsubscribe = new Subject<void>();
  #prevDay: string | undefined;
  #nextDay: string | undefined;
  #prevMonth: string | undefined;
  #nextMonth: string | undefined;
  #prevYear: string | undefined;
  #nextYear: string | undefined;

  #_selectedDate: Date | undefined;
  #_startingDay = 0;

  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  public ngOnInit(): void {
    if (this.selectedDate) {
      this.activeDate = new Date(this.selectedDate);
    } else {
      this.activeDate = this.startAtDate ?? new Date();
    }

    this.#resourcesSvc
      .getStrings({
        prevDay: 'skyux_datepicker_move_calendar_previous_day',
        nextDay: 'skyux_datepicker_move_calendar_next_day',
        prevMonth: 'skyux_datepicker_move_calendar_previous_month',
        nextMonth: 'skyux_datepicker_move_calendar_next_month',
        prevYear: 'skyux_datepicker_move_calendar_previous_year',
        nextYear: 'skyux_datepicker_move_calendar_next_year',
      })
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((resources) => {
        this.#prevDay = resources.prevDay;
        this.#nextDay = resources.nextDay;
        this.#prevMonth = resources.prevMonth;
        this.#nextMonth = resources.nextMonth;
        this.#prevYear = resources.prevYear;
        this.#nextYear = resources.nextYear;

        this.refreshView();
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.refreshView();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public setCompareHandler(handler: DateComparator, type: string): void {
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

  public compare(
    date1: Date | undefined,
    date2: Date | undefined,
  ): number | undefined {
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

    /* istanbul ignore next */
    return undefined;
  }

  public setRefreshViewHandler(handler: () => string, type: string): void {
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
      this.title = this.refreshViewHandlerDay();
      this.previousLabel = this.#prevDay;
      this.nextLabel = this.#nextDay;
    }

    if (this.datepickerMode === 'month' && this.refreshViewHandlerMonth) {
      this.title = this.refreshViewHandlerMonth();
      this.previousLabel = this.#prevMonth;
      this.nextLabel = this.#nextMonth;
    }

    if (this.datepickerMode === 'year' && this.refreshViewHandlerYear) {
      this.title = this.refreshViewHandlerYear();
      this.previousLabel = this.#prevYear;
      this.nextLabel = this.#nextYear;
    }
  }

  public setKeydownHandler(handler: KeyboardEventHandler, type: string): void {
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

  public isActive(dateObject: SkyDayPickerContext): boolean {
    if (this.compare(dateObject.date, this.activeDate) === 0) {
      this.activeDateId = dateObject.uid;
      return true;
    }

    return false;
  }

  public onKeydown(event: KeyboardEvent): void {
    const key = event.key?.toLowerCase();

    if (!this.keys.includes(key) || event.shiftKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (key === 'enter' || key === 'spacebar' || key === ' ') {
      if (this.isDisabled(this.activeDate)) {
        return;
      }
      this.select(this.activeDate);
    } else if (event.ctrlKey && (key === 'arrowup' || key === 'arrowdown')) {
      this.toggleMode(key === 'arrowup' ? 1 : -1);
    } else {
      this.handleKeydown(key, event);
      this.refreshView();
    }
  }

  public createDateObject(
    date: Date,
    format: string,
    isSecondary: boolean,
    id: string,
  ): SkyDayPickerContext {
    const customDateMatch = this.#getCustomDate(date);

    const dateObject: SkyDayPickerContext = {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      label: this.dateFilter(date, format),
      selected:
        !!this.selectedDate && this.compare(date, this.selectedDate) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0,
      secondary: isSecondary,
      uid: id,
      keyDate: customDateMatch ? customDateMatch.keyDate : undefined,
      keyDateText: customDateMatch ? customDateMatch.keyDateText : [],
    };

    return dateObject;
  }

  public createCalendarRows(
    dates: SkyDayPickerContext[],
    size: number,
  ): SkyDayPickerContext[][] {
    const rows: SkyDayPickerContext[][] = [];
    while (dates.length > 0) {
      rows.push(dates.splice(0, size));
    }
    return rows;
  }

  /*
    This is ensures that no strangeness happens when converting a date to local time.
  */
  public fixTimeZone(date: Date): Date {
    const newDate = new Date(date);
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());

    return newDate;
  }

  public selectCalendar(event: Event, date: Date, closePicker = false): void {
    if (!closePicker) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.select(date);
  }

  public select(date: Date, isManual = true): void {
    this.activeDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    /*
        Only actually select date if in minMode (day picker mode).
        Otherwise, just change the active view for the datepicker.
    */
    if (this.datepickerMode === this.minMode) {
      this.selectedDate = new Date(this.activeDate);
      if (isManual) {
        this.selectedDateChange.emit(this.selectedDate);
      }
    } else {
      this.datepickerMode =
        this.modes[this.modes.indexOf(this.datepickerMode) - 1];
      this.calendarModeChange.emit(this.datepickerMode);
    }

    this.refreshView();
  }

  public moveCalendar(event: Event, direction: number): void {
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
      const year =
        this.activeDate.getFullYear() + direction * (expectedStep.years || 0);
      const month =
        this.activeDate.getMonth() + direction * (expectedStep.months || 0);

      this.activeDate = new Date(year, month, 1);

      this.refreshView();
    }
  }

  public toggleModeCalendar(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleMode(1);
  }

  public toggleMode(direction: number): void {
    /*istanbul ignore next */
    direction = direction || 1;

    /* istanbul ignore else */
    /* sanity check */
    if (
      !(direction === 1 && this.datepickerMode === this.maxMode) &&
      !(this.datepickerMode === this.minMode && direction === -1)
    ) {
      this.datepickerMode =
        this.modes[this.modes.indexOf(this.datepickerMode) + direction];
      this.calendarModeChange.emit(this.datepickerMode);
      this.refreshView();
    }
  }

  public announceDate(date: Date, format: string): void {
    const caption = this.dateFilter(date, format);
    this.#liveAnnouncerSvc.announce(caption);
  }

  /**
   * Date is disabled if it meets any of these criteria:
   * 1. Date falls outside the min or max dates set by the SkyDatepickerConfigService.
   * 2. Date is marked as disabled in the customDates array.
   */
  protected isDisabled(date: Date): boolean {
    const customDate = this.#getCustomDate(date);
    const minDateCompare = this.compare(date, this.minDate);
    const maxDateCompare = this.compare(date, this.maxDate);

    return (
      (minDateCompare !== undefined && minDateCompare < 0) ||
      (maxDateCompare !== undefined && maxDateCompare > 0) ||
      !!customDate?.disabled
    );
  }

  #getCustomDate(date: Date): SkyDatepickerCustomDate | undefined {
    if (this.customDates) {
      return this.customDates.find((customDate: SkyDatepickerCustomDate) => {
        return customDate.date.getTime() === date.getTime();
      });
    }
    return undefined;
  }
}
