import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './filter-summary.component.fixture.html',
  standalone: false,
})
export class FilterSummaryTestComponent {
  public appliedFilters = [
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

  public onDismiss(): void {
    this.dismissed = true;
  }

  public filterButtonClicked(): void {
    this.summaryClicked = true;
  }
}
