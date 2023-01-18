import { Component } from '@angular/core';
import {
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { map } from 'rxjs/operators';

import { SelectionModalDemoPerson } from './selection-modal-demo-person';
import { SelectionModalDemoService } from './selection-modal-demo.service';

@Component({
  selector: 'app-selection-modal-demo',
  templateUrl: './selection-modal-demo.component.html',
})
export class SelectionModalDemoComponent {
  public selectedPeople: SelectionModalDemoPerson[] | undefined;

  #searchSvc: SelectionModalDemoService;
  #selectionModalSvc: SkySelectionModalService;

  constructor(
    searchSvc: SelectionModalDemoService,
    selectionModalSvc: SkySelectionModalService
  ) {
    this.#searchSvc = searchSvc;
    this.#selectionModalSvc = selectionModalSvc;
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
    });

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.selectedPeople = args.selectedItems as SelectionModalDemoPerson[];
      }
    });
  }
}
