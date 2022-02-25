import { Component } from '@angular/core';

import { ListFilterModel } from '../filter.model';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-filter-summary.component.fixture.html',
})
export class ListFilterSummaryTestComponent {
  public clickedItem: ListFilterModel;
  public openFilterModal(item: ListFilterModel) {
    this.clickedItem = item;
  }
}
