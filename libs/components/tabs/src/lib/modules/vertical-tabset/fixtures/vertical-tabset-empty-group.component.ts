import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset-empty-group.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VerticalTabsetEmptyGroupTestComponent {
  public maintainTabContent = false;
}
