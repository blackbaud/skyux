import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: 'daypicker-button.component.html',
})
export class SkyDayPickerButtonComponent {
  /**
   * The date this picker button will represent on the calendar.
   */
  @Input()
  public date: SkyDayPickerContext | undefined;

  public readonly datepicker = inject(SkyDatepickerCalendarInnerComponent);
}
