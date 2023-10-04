import { Component, inject } from '@angular/core';
import {
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { SelectionModalPlaygroundService } from './selection-modal-playground.service';
import { SelectionModalPlaygroundPerson } from './types/selection-modal-playground-person';

@Component({
  selector: 'app-selection-modal',
  templateUrl: './selection-modal.component.html',
})
export class SelectionModalComponent {
  protected selectedPeople: SelectionModalPlaygroundPerson[] | undefined;

  readonly #searchSvc = inject(SelectionModalPlaygroundService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  protected showSelectionModal(): void {
    const instance = this.#selectionModalSvc.open({
      descriptorProperty: 'name',
      idProperty: 'id',
      searchAsync: (args) =>
        this.#searchSvc.search(args.searchText).pipe(
          map(
            (results): SkySelectionModalSearchResult => ({
              hasMore: results.hasMore,
              items: results.people,
              totalCount: results.totalCount,
            })
          )
        ),
      selectMode: 'single',
    });

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.selectedPeople =
          args.selectedItems as SelectionModalPlaygroundPerson[];
      }
    });
  }
}
