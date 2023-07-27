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

import { SelectionModalDemoAddItemComponent } from './selection-modal-demo-add-item.component';
import { SelectionModalDemoPerson } from './selection-modal-demo-person';
import { SelectionModalDemoService } from './selection-modal-demo.service';

@Component({
  selector: 'app-selection-modal-demo',
  templateUrl: './selection-modal-demo.component.html',
})
export class SelectionModalDemoComponent implements OnDestroy {
  public selectedPeople: SelectionModalDemoPerson[] | undefined;

  #modalService = inject(SkyModalService);
  #searchSvc = inject(SelectionModalDemoService);
  #selectionModalSvc = inject(SkySelectionModalService);
  #subscriptions = new Subscription();

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }

  public showSelectionModal(): void {
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
        const modal = this.#modalService.open(
          SelectionModalDemoAddItemComponent
        );
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
          this.selectedPeople =
            args.selectedItems as SelectionModalDemoPerson[];
        }
      })
    );
  }
}
