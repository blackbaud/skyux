import { Injectable } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyAutocompleteSearchAsyncResult } from '../autocomplete/types/autocomplete-search-async-result';

import { SkySelectionModalComponent } from './selection-modal.component';
import { SkySelectionModalAddClickEventArgs } from './types/selection-modal-add-click-event-args';
import { SkySelectionModalCloseArgs } from './types/selection-modal-close-args';
import { SkySelectionModalContext } from './types/selection-modal-context';
import { SkySelectionModalInstance } from './types/selection-modal-instance';
import { SkySelectionModalOpenArgs } from './types/selection-modal-open-args';

/**
 * Displays a modal for selecting one or more values.
 * @docsIncludeIds SkySelectionModalAddCallbackArgs, SkySelectionModalAddClickEventArgs, SkySelectionModalCloseArgs, SkySelectionModalOpenArgs, SkySelectionModalResult, SkySelectionModalSearchArgs, SkySelectionModalSearchResult, SkySelectionModalHarness, SkySelectionModalSearchResultHarnessFilters, SkySelectionModalSearchResultHarness, LookupSelectionModalBasicExampleComponent, LookupSelectionModalAddItemExampleComponent
 */
@Injectable({
  providedIn: 'root',
})
export class SkySelectionModalService {
  #modalSvc: SkyModalService;

  constructor(modalSvc: SkyModalService) {
    this.#modalSvc = modalSvc;
  }

  /**
   * Opens the selection modal.
   * @param args Parameters for the selection modal.
   */
  public open(args: SkySelectionModalOpenArgs): SkySelectionModalInstance {
    const initialValue = args.value;

    const context = new SkySelectionModalContext(
      args.descriptorProperty,
      args.idProperty,
      args.initialSearch || '',
      initialValue || [],
      (searchArgs) => {
        return args.searchAsync({
          offset: searchArgs.offset,
          searchText: searchArgs.searchText,
          continuationData: searchArgs.continuationData,
        }) as Observable<SkyAutocompleteSearchAsyncResult>;
      },
      args.selectMode,
      args.selectionDescriptor ||
        (args.selectMode === 'single' ? 'item' : 'items'),
      args.showAddButton || false,
      {
        itemTemplate: args.itemTemplate,
        title: args.title,
      },
    );

    const modalInstance = this.#modalSvc.open(SkySelectionModalComponent, {
      providers: [
        {
          provide: SkySelectionModalContext,
          useValue: context,
        },
      ],
      size: 'large',
      wrapperClass: args.wrapperClass,
    });

    const instance = new SkySelectionModalInstance(
      modalInstance.componentInstance.id,
    );

    instance.itemAdded
      .pipe(takeUntil(modalInstance.closed))
      .subscribe((item) => {
        modalInstance.componentInstance.addItem(item);
      });

    modalInstance.closed.subscribe((modalCloseArgs) => {
      let closeArgs: SkySelectionModalCloseArgs;

      switch (modalCloseArgs.reason) {
        case 'save':
          closeArgs = {
            reason: 'save',
            selectedItems: modalCloseArgs.data.map(
              (item: { itemData: unknown }) => item.itemData,
            ),
          };
          break;
        case 'cancel':
          closeArgs = { reason: 'cancel' };
          break;
        default:
          closeArgs = { reason: 'close' };
      }

      instance.close(closeArgs);
    });

    const selectionModal = modalInstance.componentInstance;

    selectionModal.addClick
      .pipe(takeUntil(modalInstance.closed))
      .subscribe(() => {
        if (args.addClick) {
          const addArgs: SkySelectionModalAddClickEventArgs = {
            itemAdded(args) {
              selectionModal.addItem(args.item);
            },
          };

          args.addClick(addArgs);
        }
      });

    return instance;
  }
}
