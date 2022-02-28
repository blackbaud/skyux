import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyAutocompleteSearchAsyncResult } from '../autocomplete/types/autocomplete-search-async-result';

import { SkyLookupShowMoreNativePickerAsyncContext } from './types/lookup-show-more-native-picker-async-context';

/**
 * @internal
 * Internal component to implement the native picker.
 */
@Component({
  selector: 'sky-lookup-show-more-async-modal',
  templateUrl: './lookup-show-more-async-modal.component.html',
  styleUrls: ['./lookup-show-more-async-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLookupShowMoreAsyncModalComponent implements OnInit, OnDestroy {
  /**
   * @internal
   * Fires when users select the button to add new options to the list.
   */
  public addClick: Subject<void> = new Subject();

  public items: unknown[];

  public displayedItems: unknown[] = [];
  public onlyShowSelected: boolean = false;
  public searchText: string;
  public isSearching = false;
  public hasMoreItems = false;
  public isLoadingMore = false;
  public selectedIdMap: Map<unknown, unknown>;

  private continuationData: unknown;
  private offset: number = 0;
  private ngUnsubscribe = new Subject<void>();
  private currentSearchSub: Subscription | undefined;

  constructor(
    public modalInstance: SkyModalInstance,
    public context: SkyLookupShowMoreNativePickerAsyncContext,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.searchText = this.context.initialSearch;

    this.createInitialSelectedItemsMap();
    this.loadSearchResults();
  }

  public ngOnDestroy(): void {
    this.cancelCurrentSearch();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public addButtonClicked(): void {
    this.addClick.next();
  }

  public clearAll(): void {
    this.selectedIdMap = new Map(this.selectedIdMap);

    // Only deselect items that have been loaded; items that would be loaded
    // after an infinite scroll event should remain selected.
    for (const item of this.items) {
      this.selectedIdMap.delete(item[this.context.idProperty]);
    }

    this.updateDisplayedItems();

    this.changeDetector.markForCheck();
  }

  public itemClick(selectedItem: any): void {
    if (this.context.selectMode === 'single') {
      this.onItemSelect(!selectedItem.selected, selectedItem);
    }
  }

  public onItemSelect(newSelectState: boolean, itemToSelect: any): void {
    const itemId = itemToSelect[this.context.idProperty];

    // Create a new Map so the pipe transform will execute on the next
    // change detection cycle.
    this.selectedIdMap = new Map(this.selectedIdMap);

    if (this.context.selectMode === 'single') {
      if (newSelectState) {
        this.selectedIdMap.clear();
        this.selectedIdMap.set(itemId, itemToSelect);
      }
    } else {
      if (newSelectState) {
        this.selectedIdMap.set(itemId, itemToSelect);
      } else {
        this.selectedIdMap.delete(itemId);
      }
    }

    this.updateDisplayedItems();
  }

  public searchApplied(searchText: string) {
    this.offset = 0;
    this.searchText = searchText;

    this.loadSearchResults();
  }

  public selectAll(): void {
    this.selectedIdMap = new Map();

    for (const item of this.items) {
      this.selectedIdMap.set(item[this.context.idProperty], item);
    }

    this.updateDisplayedItems();
  }

  public infiniteScrollEnd(): void {
    this.cancelCurrentSearch();

    /* Sanity check - else case would only happen if this was called directly */
    /* istanbul ignore else */
    if (this.hasMoreItems) {
      this.isLoadingMore = true;

      this.performSearch((result) => {
        this.items = this.items.concat(result.items);

        this.updateDisplayedItems();

        this.isLoadingMore = false;
      });
    }
  }

  public save(): void {
    const selectedItems = Array.from(
      this.selectedIdMap.values(),
      (itemData, index) => ({
        index,
        itemData,
      })
    ).sort((a, b) => {
      return this.items.indexOf(a.itemData) < this.items.indexOf(b.itemData)
        ? -1
        : 1;
    });

    this.modalInstance.save(selectedItems);
  }

  private loadSearchResults(): void {
    this.cancelCurrentSearch();

    this.isSearching = true;

    this.performSearch((result) => {
      this.isSearching = false;
      this.items = result.items;
    });
  }

  private createInitialSelectedItemsMap(): void {
    this.selectedIdMap = new Map(
      this.context.initialValue.map((item) => [
        item[this.context.idProperty],
        item,
      ])
    );
  }

  private performSearch(
    processResults: (result: SkyAutocompleteSearchAsyncResult) => void
  ): void {
    this.currentSearchSub = this.context
      .searchAsync({
        displayType: 'modal',
        offset: this.offset,
        searchText: this.searchText || '',
        continuationData: this.continuationData,
      })
      .pipe(take(1))
      .subscribe((result) => {
        processResults(result);

        this.continuationData = result.continuationData;
        this.hasMoreItems = result.hasMore;
        this.offset = this.items.length;

        this.updateDisplayedItems();

        this.changeDetector.markForCheck();
      });
  }

  private updateDisplayedItems(): void {
    if (this.onlyShowSelected) {
      this.displayedItems = this.items.filter((item) =>
        this.selectedIdMap.has(item[this.context.idProperty])
      );
    } else {
      this.displayedItems = this.items;
    }
  }

  private cancelCurrentSearch(): void {
    if (this.currentSearchSub) {
      this.currentSearchSub.unsubscribe();
      this.currentSearchSub = undefined;
      this.isLoadingMore = false;
      this.isSearching = false;
    }
  }
}
