import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset-no-group.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class VerticalTabsetNoGroupTestComponent {
  public currentIndex: number | undefined;
  public maintainTabContent = false;

  public indexChanged(index: number) {
    this.currentIndex = index;
  }
}
