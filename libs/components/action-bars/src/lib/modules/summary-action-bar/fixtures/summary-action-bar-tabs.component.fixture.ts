import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-summary-action-bar-tabs-test',
  templateUrl: './summary-action-bar-tabs.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkySummaryActionBarTabsTestComponent {
  public showBar1 = true;

  public showBar2 = false;

  public activeTab = 0;
}
