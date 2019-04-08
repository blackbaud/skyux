import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType
} from '@skyux/popovers';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyDatepickerCalendarComponent
} from './datepicker-calendar.component';

@Component({
  selector: 'sky-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDatepickerComponent implements OnDestroy {
  public get disabled(): boolean {
    return this._disabled;
  }

  public set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetector.markForCheck();
  }

  public get dropdownController(): Observable<SkyDropdownMessage> {
    return this._dropdownController;
  }

  public set selectedDate(value: Date) {
    this.calendar.writeValue(value);
  }

  public dateChange = new EventEmitter<Date>();
  public maxDate: Date;
  public minDate: Date;
  public startingDay: number;

  @ViewChild(SkyDatepickerCalendarComponent)
  private calendar: SkyDatepickerCalendarComponent;

  private _disabled = false;
  private _dropdownController = new Subject<SkyDropdownMessage>();

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public ngOnDestroy(): void {
    this._dropdownController.complete();
    this.dateChange.complete();
  }

  public onCalendarModeChange(): void {
    this._dropdownController.next({
      type: SkyDropdownMessageType.Reposition
    });
  }

  public onSelectedDateChange(value: Date): void {
    this.dateChange.emit(value);
    this._dropdownController.next({
      type: SkyDropdownMessageType.Close
    });
  }
}
