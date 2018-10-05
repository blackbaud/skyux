import {
  Component,
  EventEmitter,
  ViewChild
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { SkyDatepickerCalendarComponent } from './datepicker-calendar.component';

import {
  SkyDropdownComponent,
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

@Component({
  selector: 'sky-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class SkyDatepickerComponent {
  @ViewChild(SkyDatepickerCalendarComponent)
  public calendar: SkyDatepickerCalendarComponent;

  @ViewChild(SkyDropdownComponent)
  public dropdown: SkyDropdownComponent;

  public dropdownController = new Subject<SkyDropdownMessage>();
  public dateChanged: EventEmitter<Date> = new EventEmitter<Date>();
  public disabled: boolean;
  private _startingDay: number = 0;
  public maxDate: Date;
  public minDate: Date;

  public get startingDay(): number {
    return this._startingDay;
  }
  public set startingDay(value: number) {
    this._startingDay = value;
  }

  public dateSelected(newDate: Date) {
    this.dateChanged.emit(newDate);
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }

  public setSelectedDate(newDate: Date) {
    this.calendar.writeValue(newDate);
  }

  public setMinDate(_minDate: Date) {
    this.minDate = _minDate;
  }

  public setMaxDate(_maxDate: Date) {
    this.maxDate = _maxDate;
  }

  public onCalendarModeChange() {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Reposition
    });
  }
}
