import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-datepicker-no-format-test',
  templateUrl: './datepicker-no-format.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DatepickerNoFormatTestComponent {
  public selectedDate: any;
}
