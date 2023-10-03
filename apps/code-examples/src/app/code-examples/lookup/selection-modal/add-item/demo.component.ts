import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  SkySelectionModalAddClickEventArgs,
  SkySelectionModalCloseArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AddItemModalComponent } from './add-item-modal.component';
import { DemoService } from './demo.service';
import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule],
})
export class DemoComponent implements OnDestroy {
  protected selectedPeople: Person[] | undefined;

  #subscriptions = new Subscription();

  readonly #modalSvc = inject(SkyModalService);
  readonly #searchSvc = inject(DemoService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

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
      showAddButton: true,
      addClick: (args: SkySelectionModalAddClickEventArgs) => {
        const modal = this.#modalSvc.open(AddItemModalComponent);

        this.#subscriptions.add(
          modal.closed.subscribe((close: SkyModalCloseArgs) => {
            if (close.reason === 'save') {
              this.#searchSvc.addItem(close.data);
              args.itemAdded({ item: close.data });
            }
          })
        );
      },
    });

    this.#subscriptions.add(
      instance.closed.subscribe((args: SkySelectionModalCloseArgs) => {
        if (args.reason === 'save') {
          this.selectedPeople = args.selectedItems as Person[];
        }
      })
    );
  }
}
