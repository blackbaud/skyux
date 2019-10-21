import {
  ChangeDetectorRef,
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import { SkyTimepickerTimeOutput } from './timepicker.interface';

const moment = require('moment');

@Component({
  selector: 'sky-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTimepickerComponent implements OnInit {
  @Output()
  public selectedTimeChanged: EventEmitter<SkyTimepickerTimeOutput> =
    new EventEmitter<SkyTimepickerTimeOutput>();

  public dropdownController = new Subject<SkyDropdownMessage>();
  public activeTime: Date;
  public returnFormat: string;
  public timeFormat: string = 'hh';
  public hours: Array<number>;
  public minutes: Array<number>;
  public localeFormat: string;
  public minuteMultiplier: number;
  public is8601: boolean = false;
  private _disabled: boolean;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this.setFormat(this.timeFormat);
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(value: boolean) {
    this._disabled = value;

    this.changeDetector.markForCheck();
  }

  public setFormat(format: string) {
    let h: number = 12;
    let m: number = 12;
    let minuteMultiplier: number = 5;
    let localeFormat: string = 'h:mm A';
    if (format === 'hh') { h = 12; m = 12; minuteMultiplier = 5; localeFormat = 'h:mm A'; }
    if (format === 'HH') {
      h = 24;
      m = 4;
      minuteMultiplier = 15;
      localeFormat = 'HH:mm';
      this.is8601 = true;
    }
    let data: {
      'hours': Array<number>,
      'minutes': Array<number>,
      'localeFormat': string,
      'minuteMultiplier': number
    };

    data = {
      'hours': Array.apply(undefined, Array(h))
        .map(function (x: number, i: number) {
          if (format === 'hh') { return ++i; }
          /* istanbul ignore else */
          if (format === 'HH') { return i; }
          /* istanbul ignore next */
          /* sanity check */
          return 0;
        }),
      'minutes': Array.apply(undefined, Array(m))
        .map(function (x: number, i: number) {
          return i * minuteMultiplier;
        }),
      'localeFormat': localeFormat,
      'minuteMultiplier': minuteMultiplier
    };

    this.hours = data.hours;
    this.minutes = data.minutes;
    this.localeFormat = data.localeFormat;
    this.minuteMultiplier = data.minuteMultiplier;
  }

  public set selectedTime(newTime: SkyTimepickerTimeOutput) {
    if (typeof newTime !== 'undefined') {
      /* sanity check */
      /* istanbul ignore else */
      if (newTime.local !== 'Invalid date') {
        this.activeTime = newTime.iso8601;
      }
    }
  }

  public get selectedTime() {
    const time: SkyTimepickerTimeOutput = {
      hour: moment(this.activeTime).hour(),
      minute: moment(this.activeTime).minute(),
      meridie: moment(this.activeTime).format('A'),
      timezone: parseInt(moment(this.activeTime).format('Z'), 10),
      iso8601: this.activeTime,
      local: moment(this.activeTime).format(this.localeFormat),
      customFormat: (typeof this.returnFormat !== 'undefined')
        ? this.returnFormat : this.localeFormat
    };

    return time;
  }

  public set selectedHour(setHour: number) {
    let hour: number;
    let hourOffset: number = 0;
    if (this.selectedMeridies === 'AM' && setHour === 12) { hourOffset = -12; }
    if (this.selectedMeridies === 'PM' && setHour !== 12) { hourOffset = 12; }
    if (this.is8601) { hourOffset = 0; }
    hour = moment({ 'hour': setHour }).add(hourOffset, 'hours').hour();

    this.activeTime = moment({
      'hour': hour,
      'minute': moment(this.activeTime).get('minute') + 0
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public set selectedMinute(minute: number) {
    this.activeTime = moment({
      'hour': moment(this.activeTime).get('hour') + 0,
      'minute': minute
    }).toDate();
    this.selectedTimeChanged.emit(this.selectedTime);
  }

  public set selectedMeridies(meridies: string) {
    /* istanbul ignore else */
    if (!this.is8601) {
      if (meridies !== this.selectedMeridies) {
        this.activeTime = moment(this.activeTime).add(12, 'hours').toDate();
        this.selectedTimeChanged.emit(this.selectedTime);
      }
    }
  }

  public get selectedHour() {
    if (!this.is8601) {
      /* istanbul ignore next */
      return parseInt(moment(this.activeTime).format('h'), 0) || 1;
    }
    /* istanbul ignore else */
    if (this.is8601) {
      return moment(this.activeTime).hour() + 0;
    }
  }

  public get selectedMinute() {
    return moment(this.activeTime).minute() + 0;
  }

  public get selectedMeridies() {
    if (this.activeTime) {
      return moment(this.activeTime).format('A');
    }
    return '';
  }

  public onButtonClick() {
    this.dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }

  public setTime(event: any) {
    /* istanbul ignore else */
    if (typeof event !== 'undefined') {
      /* istanbul ignore else */
      if (event.type === 'click') {
        event.stopPropagation();
        if (event.target.name === 'hour') {
          this.selectedHour = parseInt(event.target.innerHTML, 0);
        }
        if (event.target.name === 'minute') {
          this.selectedMinute = parseInt(event.target.innerHTML, 0);
        }
        if (event.target.name === 'meridie') {
          this.selectedMeridies = event.target.innerHTML;
        }
      }
    }
  }
}
