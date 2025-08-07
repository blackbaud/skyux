import { Component, OnDestroy, inject } from '@angular/core';
import {
  SkySelectionModalAddClickEventArgs,
  SkySelectionModalCloseArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyModalService } from '@skyux/modals';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddItemModalComponent } from './add-item-modal.component';
import { ExampleService } from './example.service';
import { Person } from './person';

/**
 * @title Selection modal with add item functionality
 */
@Component({
  standalone: true,
  selector: 'app-lookup-selection-modal-add-item-example',
  templateUrl: './example.component.html',
})
export class LookupSelectionModalAddItemExampleComponent implements OnDestroy {
  protected selectedPeople: Person[] | undefined;

  #subscriptions = new Subscription();

  readonly #modalSvc = inject(SkyModalService);
  readonly #searchSvc = inject(ExampleService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

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
      showAddButton: true,
      addClick: (args: SkySelectionModalAddClickEventArgs) => {
        const modal = this.#modalSvc.open(AddItemModalComponent);

        this.#subscriptions.add(
          modal.closed.subscribe((close) => {
            if (close.reason === 'save') {
              const person = close.data as Person;
              this.#searchSvc.addItem(person);
              args.itemAdded({ item: person });
            }
          }),
        );
      },
    });

    this.#subscriptions.add(
      instance.closed.subscribe((args: SkySelectionModalCloseArgs) => {
        if (args.reason === 'save') {
          this.selectedPeople = args.selectedItems as Person[];
        }
      }),
    );
  }
}
