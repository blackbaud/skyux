import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './column.component.fixture.html',
  standalone: false,
})
export class ColumnTestComponent {
  public xsSize = input<number | undefined>(1);
  public smallSize = input<number | undefined>(1);
  public mediumSize = input<number | undefined>(2);
  public largeSize = input<number | undefined>(5);
}
