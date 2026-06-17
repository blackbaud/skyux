import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';

@Component({
  selector: 'sky-filter-bar-fixture',
  templateUrl: './filter-bar-harness-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyFilterBarModule],
})
export class FilterBarHarnessTestComponent {
  public appliedFilters = signal([
    {
      filterId: 'filter1',
      filterValue: { value: 'value1' },
    },
  ]);
  public selectedFilterIds = signal(['filter1', 'filter2']);

  public modalComponent = TestModalComponent;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestModalComponent {}
