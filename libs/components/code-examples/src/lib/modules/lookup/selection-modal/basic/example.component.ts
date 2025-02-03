import { Component, inject } from '@angular/core';
import {
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { DemoService } from './example.service';
import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-lookup-selection-modal-basic-example',
  templateUrl: './example.component.html',
})
export class LookupSelectionModalBasicExampleComponent {
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
