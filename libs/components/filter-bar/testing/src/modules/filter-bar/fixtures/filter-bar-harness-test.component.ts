import { Component, signal } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable, of } from 'rxjs';

@Component({
  selector: 'sky-filter-bar-fixture',
  templateUrl: './filter-bar-harness-test.component.html',
  imports: [SkyFilterBarModule],
})
export class FilterBarHarnessTestComponent {
  public filters = signal([
    {
      id: 'filter1',
      name: 'Test filter 1',
      filterValue: { value: 'value1' },
      filterModalConfig: { modalComponent: class {} },
    },
    {
      id: 'filter2',
      name: 'Test filter 2',
      filterValue: undefined,
      filterModalConfig: { modalComponent: class {} },
    },
  ]);

  public searchFn = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> =>
    of({ hasMore: false, totalCount: 0, items: [] });

  public onFilterUpdate(filterName: string): void {
    console.log(`Filter ${filterName} updated`);
  }
}
