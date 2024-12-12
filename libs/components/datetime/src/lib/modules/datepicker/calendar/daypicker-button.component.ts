import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { SkyDatepickerCalendarInnerComponent } from './datepicker-calendar-inner.component';
import { SkyDatepickerCalendarLabelPipe } from './datepicker-calendar-label.pipe';
import { SkyDatepickerDate } from './datepicker-date';

/**
 * @internal
 */
@Component({
  imports: [CommonModule, SkyDatepickerCalendarLabelPipe],
  selector: 'sky-daypicker-button',
  standalone: true,
  styleUrl: './daypicker-button.component.scss',
  templateUrl: 'daypicker-button.component.html',
})
export class SkyDayPickerButtonComponent {
  /**
   * The date this picker button will represent on the calendar.
   */
  @Input()
  public date: SkyDatepickerDate | undefined;

  constructor(public datepicker: SkyDatepickerCalendarInnerComponent) {}
}
