import { Component, input, model } from '@angular/core';

import {
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
} from '@skyux/lookup';

import { Observable, of } from 'rxjs';

import { SkyFilterBarModule } from '../filter-bar.module';
import { SkyFilterBarFilterItem } from '../models/filter-bar-filter-item';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public filters = model<SkyFilterBarFilterItem[]>([
    { name: 'filter 1', id: '1' },
    { name: 'filter 2', id: '2' },
    { name: 'filter 3', id: '3' },
  ]);

  public allFilters = input<SkyFilterBarFilterItem[]>([
    { name: 'filter 1', id: '1' },
    { name: 'filter 2', id: '2' },
    { name: 'filter 3', id: '3' },
    { name: 'filter 4', id: '4' },
    { name: 'filter 5', id: '5' },
    { name: 'filter 6', id: '6' },
    { name: 'filter 7', id: '7' },
    { name: 'filter 8', id: '8' },
  ]);

  public searchFn? = (
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> => {
    let retVal = this.allFilters();
    if (args?.searchText) {
      retVal = retVal.filter((filter) => filter.name.includes(args.searchText));
    }
    return of({ items: retVal, totalCount: retVal.length });
  };
}
