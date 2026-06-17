import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './nested-repeater.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class NestedRepeaterTestComponent {}
