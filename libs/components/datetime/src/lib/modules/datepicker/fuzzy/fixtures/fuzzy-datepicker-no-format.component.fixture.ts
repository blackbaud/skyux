import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-fuzzy-datepicker-no-format-test',
  templateUrl: './fuzzy-datepicker-no-format.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FuzzyDatepickerNoFormatTestComponent {
  public selectedDate: any;
}
