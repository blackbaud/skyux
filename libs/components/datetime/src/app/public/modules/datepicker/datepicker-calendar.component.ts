import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import {
  SkyDatepickerAdapterService
} from './datepicker-adapter.service';

import {
  SkyDatepickerCalendarInnerComponent
} from './datepicker-calendar-inner.component';

import {
  SkyDatepickerConfigService
} from './datepicker-config.service';

import {
  SkyDateFormatter
} from './date-formatter';

@Component({
  selector: 'sky-datepicker-calendar',
  templateUrl: './datepicker-calendar.component.html',
  styleUrls: ['./datepicker-calendar.component.scss'],
  providers: [SkyDatepickerAdapterService]
})
export class SkyDatepickerCalendarComponent implements AfterViewInit {

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  /** currently selected date */
  @Input()
  public selectedDate: Date;

  /** starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday) */
  @Input()
  public set startingDay(start: number) {
    this._startingDay = start;
  }

  public get startingDay() {
    return this._startingDay || 0;
  }

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(undefined);

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * @internal
   * Indicates if the calendar element's visiblity property is 'visible'.
   */
  public get isVisible(): boolean {
    return this.adapter.elementIsVisible();
  }

  @ViewChild(SkyDatepickerCalendarInnerComponent)
  public _datepicker: SkyDatepickerCalendarInnerComponent;

  protected _now: Date = new Date();
  protected config: SkyDatepickerConfigService;

  private formatter = new SkyDateFormatter();

  private _startingDay: number;

  public constructor(
    private adapter: SkyDatepickerAdapterService,
    config: SkyDatepickerConfigService,
    private elementRef: ElementRef) {
    this.config = config;
    this.configureOptions();
  }

  public ngAfterViewInit(): void {
    this.adapter.init(this.elementRef);
  }

  public configureOptions(): void {
    Object.assign(this, this.config);
  }

  public onCalendarModeChange(event: string): void {
    this.calendarModeChange.emit(event);
  }

  public onSelectedDateChange(event: Date): void {
    this.selectedDateChange.emit(event);
  }

  public writeValue(value: Date): void {
    if (value !== undefined
      && this.formatter.dateIsValid(value)
      && this.selectedDate !== undefined
      && this._datepicker.compareHandlerDay(value, this.selectedDate) === 0) {
      return;
    }

    if (this.formatter.dateIsValid(value)) {
      this.selectedDate = value;
      this._datepicker.select(value, false);
    } else {
      this.selectedDate = new Date();
      this._datepicker.select(new Date(), false);
    }

  }
}
