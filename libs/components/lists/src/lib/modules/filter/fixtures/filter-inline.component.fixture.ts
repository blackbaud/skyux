import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-inline.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FilterInlineTestComponent {}
