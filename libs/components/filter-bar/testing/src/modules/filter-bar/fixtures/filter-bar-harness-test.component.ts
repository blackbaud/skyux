import { Component, signal } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';

@Component({
  selector: 'sky-filter-bar-fixture',
  templateUrl: './filter-bar-harness-test.component.html',
  imports: [SkyFilterBarModule],
})
export class FilterBarHarnessTestComponent {
  public filters = signal([
    {
      id: 'filter1',
      filterValue: { value: 'value1' },
    },
    {
      id: 'filter2',
      filterValue: undefined,
    },
  ]);
  public selectedFilters = signal(['filter1', 'filter2']);

  public modalConfig = { modalComponent: class {} };
}
