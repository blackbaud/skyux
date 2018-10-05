import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
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
  styleUrls: ['./datepicker-calendar.component.scss']
})
export class SkyDatepickerCalendarComponent {

  @Input()
  public minDate: Date;

  @Input()
  public maxDate: Date;

  /** starting day of the week from 0-6 (0=Sunday, ..., 6=Saturday) */
  @Input()
  public startingDay: number;

  /** currently selected date */
  @Input()
  public selectedDate: Date;

  @Output()
  public selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>(undefined);

  @Output()
  public calendarModeChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(SkyDatepickerCalendarInnerComponent)
  public _datepicker: SkyDatepickerCalendarInnerComponent;

  protected _now: Date = new Date();
  protected config: SkyDatepickerConfigService;

  private formatter = new SkyDateFormatter();

  public constructor(config: SkyDatepickerConfigService) {
    this.config = config;
    this.configureOptions();
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
