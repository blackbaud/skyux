import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyDropdownComponent,
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
  /**
   * @internal
   * Indicates if the calendar button element or any of its children have focus.
   */
  public get buttonIsFocused(): boolean {
    return this.dropdown.buttonIsFocused;
  }

  /**
   * @internal
   * Indicates if the calendar element or any of its children have focus.
   */
  public get calendarIsFocused(): boolean {
    return this.dropdown.menuIsFocused;
  }

  /**
   * @internal
   * Indicates if the calendar element's visiblity property is 'visible'.
   */
  public get calendarIsVisible(): boolean {
    return this.calendar.isVisible;
  }

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

  @ViewChild(SkyDropdownComponent)
  private dropdown: SkyDropdownComponent;

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
