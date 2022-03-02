import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-summary.component.fixture.html',
})
export class FilterSummaryTestComponent {
  public appliedFilters: Array<any> = [
    {
      label: 'hide orange',
      dismissible: false,
    },
    {
      label: 'berry fruit type',
      dismissible: true,
    },
  ];

  public dismissed = false;

  public summaryClicked = false;

  public onDismiss() {
    this.dismissed = true;
  }

  public filterButtonClicked() {
    this.summaryClicked = true;
  }
}
