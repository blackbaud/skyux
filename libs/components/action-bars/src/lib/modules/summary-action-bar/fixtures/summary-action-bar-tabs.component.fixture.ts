import { Component } from '@angular/core';

@Component({
  selector: 'sky-summary-action-bar-tabs-test',
  templateUrl: './summary-action-bar-tabs.component.fixture.html',
})
export class SkySummaryActionBarTabsTestComponent {
  public showBar1 = true;

  public showBar2 = false;

  public activeTab = 0;

  constructor() {}
}
