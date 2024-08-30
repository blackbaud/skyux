import { Component, inject } from '@angular/core';
import {
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { DemoService } from './demo.service';
import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  protected selectedPeople: Person[] | undefined;

  readonly #searchSvc = inject(DemoService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  protected showSelectionModal(): void {
    const instance = this.#selectionModalSvc.open({
      descriptorProperty: 'name',
      idProperty: 'id',
      selectionDescriptor: 'person',
      searchAsync: (args) =>
        this.#searchSvc.search(args.searchText).pipe(
          map(
            (results): SkySelectionModalSearchResult => ({
              hasMore: results.hasMore,
              items: results.people,
              totalCount: results.totalCount,
            }),
          ),
        ),
      selectMode: 'single',
    });

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.selectedPeople = args.selectedItems as Person[];
      }
    });
  }
}
