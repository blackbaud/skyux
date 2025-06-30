import { Component } from '@angular/core';
import { SkySelectionModalSearchArgs } from '@skyux/lookup';

import { of } from 'rxjs';

import { SkyFilterBarModule } from '../filter-bar.module';

@Component({
  selector: 'sky-test-cmp',
  imports: [SkyFilterBarModule],
  templateUrl: './filter-bar.component.fixture.html',
})
export class SkyFilterBarTestComponent {
  public filters = [
    { name: 'filter 1', id: '1' },
    { name: 'filter 2', id: '2' },
    { name: 'filter 3', id: '3' },
  ];

  #filters = [
    { name: 'filter 1', id: '1' },
    { name: 'filter 2', id: '2' },
    { name: 'filter 3', id: '3' },
    { name: 'filter 4', id: '4' },
    { name: 'filter 5', id: '5' },
    { name: 'filter 6', id: '6' },
    { name: 'filter 7', id: '7' },
    { name: 'filter 8', id: '8' },
  ];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public searchFn? = (args: SkySelectionModalSearchArgs) => {
    let retVal = this.#filters;
    if (args?.searchText) {
      retVal = this.#filters.filter((filter) =>
        filter.name.includes(args.searchText),
      );
    }
    return of({ items: retVal, totalCount: retVal.length });
  };
}
