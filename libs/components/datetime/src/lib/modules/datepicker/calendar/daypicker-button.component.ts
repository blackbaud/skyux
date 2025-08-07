import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarLabelPipe } from './datepicker-calendar-label.pipe';
import { SkyDayPickerContext } from './daypicker-context';

/**
 * @internal
 */
@Component({
  imports: [CommonModule, SkyDatepickerCalendarLabelPipe],
  selector: 'sky-daypicker-button',
  styleUrl: './daypicker-button.component.scss',
  templateUrl: 'daypicker-button.component.html',
})
export class SkyDayPickerButtonComponent {
  /**
   * The date this picker button will represent on the calendar.
   */
  @Input()
  public date: SkyDayPickerContext | undefined;

  constructor(public datepicker: SkyDatepickerCalendarInnerComponent) {}
}
