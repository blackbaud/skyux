import { Component, inject } from '@angular/core';
import {
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { map, take } from 'rxjs/operators';

import { SelectionModalAddItemModalComponent } from './selection-modal-add-item-modal.component';
import { SelectionModalPlaygroundService } from './selection-modal-playground.service';
import { SelectionModalPlaygroundPerson } from './types/selection-modal-playground-person';

@Component({
  selector: 'app-selection-modal',
  templateUrl: './selection-modal.component.html',
  standalone: false,
})
export class SelectionModalComponent {
  protected selectedPeople: SelectionModalPlaygroundPerson[] | undefined;

  readonly #modalSvc = inject(SkyModalService);
  readonly #searchSvc = inject(SelectionModalPlaygroundService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  protected showSelectionModal(single = true): void {
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
            }),
          ),
        ),
      selectionDescriptor: single ? 'person' : 'people',
      selectMode: single ? 'single' : 'multiple',
      showAddButton: true,
      addClick: (args) => {
        const modal = this.#modalSvc.open(SelectionModalAddItemModalComponent);

        modal.closed.pipe(take(1)).subscribe((close: SkyModalCloseArgs) => {
          if (close.reason === 'save') {
            this.#searchSvc.addItem(close.data);
            args.itemAdded({ item: close.data });
          }
        });
      },
    });

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.selectedPeople =
          args.selectedItems as SelectionModalPlaygroundPerson[];
      }
    });
  }
}
