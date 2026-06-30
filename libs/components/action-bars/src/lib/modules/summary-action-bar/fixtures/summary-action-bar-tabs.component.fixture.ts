import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-summary-action-bar-tabs-test',
  templateUrl: './summary-action-bar-tabs.component.fixture.html',
  standalone: false,
})
export class SkySummaryActionBarTabsTestComponent {
  public showBar1 = true;

  public showBar2 = false;

  public activeTab = input<number>(0);
}
