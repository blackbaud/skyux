import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyButton } from '@skyux/forms';
import {
  SkySelectionModalAddClickEventArgs,
  SkySelectionModalCloseArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyModalService } from '@skyux/modals';

import { map } from 'rxjs/operators';

import { AddItemModalComponent } from './add-item-modal.component';
import { ExampleService } from './example.service';
import { Person } from './person';

/**
 * @title Selection modal with add item functionality
 */
@Component({
  selector: 'app-lookup-selection-modal-add-item-example',
  templateUrl: './example.component.html',
  imports: [SkyButton],
})
export class LookupSelectionModalAddItemExampleComponent {
  protected readonly selectedPeople = signal<Person[]>([]);

  readonly #destroyRef = inject(DestroyRef);
  readonly #modalSvc = inject(SkyModalService);
  readonly #searchSvc = inject(ExampleService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  protected showSelectionModal(): void {
    const instance = this.#selectionModalSvc.open({
      descriptorProperty: 'name',
      idProperty: 'id',
      selectionDescriptor: 'person',
      searchAsync: (args) =>
        this.#searchSvc.search(args.searchText).pipe(
          map((results): SkySelectionModalSearchResult => ({
            hasMore: results.hasMore,
            items: results.people,
            totalCount: results.totalCount,
          })),
        ),
      selectMode: 'single',
      showAddButton: true,
      addClick: (args: SkySelectionModalAddClickEventArgs) => {
        const modal = this.#modalSvc.open(AddItemModalComponent);

        modal.closed
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe((close) => {
            if (close.reason === 'save') {
              const person = close.data as Person;
              this.#searchSvc.addItem(person);
              args.itemAdded({ item: person });
            }
          });
      },
    });

    instance.closed
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((args: SkySelectionModalCloseArgs) => {
        if (args.reason === 'save') {
          this.selectedPeople.set(args.selectedItems as Person[]);
        }
      });
  }
}
