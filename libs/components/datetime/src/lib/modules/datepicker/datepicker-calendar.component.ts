import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { SkyDateFormatter } from './date-formatter';
import { SkyDatepickerAdapterService } from './datepicker-adapter.service';
import { SkyDatepickerCalendarChange } from './datepicker-calendar-change';
import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerConfigService } from './datepicker-config.service';
import { SkyDatepickerCustomDate } from './datepicker-custom-date';

/**
 * @internal
 */
@Component({
  selector: 'sky-datepicker-calendar',
  templateUrl: './datepicker-calendar.component.html',
  styleUrls: ['./datepicker-calendar.component.scss'],
  providers: [SkyDatepickerAdapterService],
})
export class SkyDatepickerCalendarComponent implements AfterViewInit {
  @Input()
  public customDates: SkyDatepickerCustomDate[] | undefined;

  @Input()
  public isDaypickerWaiting: boolean | undefined;

  @Input()
  public minDate: Date | undefined;

  @Input()
  public maxDate: Date | undefined;

  /** currently selected date */
  @Input()
  public selectedDate: Date;

  /** starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday) */
  @Input()
  public set startingDay(start: number | undefined) {
    this.#_startingDay = start || 0;
  }

  public get startingDay(): number {
    return this.#_startingDay;
  }

  @Output()
  public calendarDateRangeChange: EventEmitter<
    SkyDatepickerCalendarChange | undefined
  > = new EventEmitter<SkyDatepickerCalendarChange | undefined>();

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(
    undefined
  );

  /**
   * @internal
   * Indicates if the calendar element's visibility property is 'visible'.
   */
  public get isVisible(): boolean {
    return this.#adapter.elementIsVisible();
  }

  @ViewChild(SkyDatepickerCalendarInnerComponent, {
    read: SkyDatepickerCalendarInnerComponent,
    static: true,
  })
  public _datepicker: SkyDatepickerCalendarInnerComponent;

  protected _now: Date = new Date();

  #formatter = new SkyDateFormatter();

  #_startingDay = 0;

  #adapter: SkyDatepickerAdapterService;
  #config: SkyDatepickerConfigService;
  #elementRef: ElementRef;

  public constructor(
    adapter: SkyDatepickerAdapterService,
    config: SkyDatepickerConfigService,
    elementRef: ElementRef
  ) {
    this.#adapter = adapter;
    this.#config = config;
    this.#elementRef = elementRef;
    this.configureOptions();
  }

  public ngAfterViewInit(): void {
    this.#adapter.init(this.#elementRef);
  }

  public configureOptions(): void {
    Object.assign(this, this.#config);
  }

  public onCalendarDateRangeChange(
    event: SkyDatepickerCalendarChange | undefined
  ): void {
    this.calendarDateRangeChange.next(event);
  }

  public onCalendarModeChange(event: string): void {
    this.calendarModeChange.emit(event);
  }

  public onSelectedDateChange(event: Date): void {
    this.selectedDateChange.emit(event);
  }

  public writeValue(value: Date): void {
    if (
      value !== undefined &&
      this.#formatter.dateIsValid(value) &&
      this.selectedDate !== undefined &&
      this._datepicker.compareHandlerDay(value, this.selectedDate) === 0
    ) {
      return;
    }

    if (this.#formatter.dateIsValid(value)) {
      this.selectedDate = value;
      this._datepicker.select(value, false);
    } else {
      this.selectedDate = new Date();
      this._datepicker.select(new Date(), false);
    }
  }
}
