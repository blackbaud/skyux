import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import {
  SkyIdService,
  SkyLiveAnnouncerService,
  SkyViewkeeperModule,
} from '@skyux/core';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkySearchModule } from '../search/search.module';
import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkySelectionModalItemSelectedPipe } from './selection-modal-item-selected.pipe';
import { SkySelectionModalContext } from './types/selection-modal-context';
import { SkySelectionModalSearchResult } from './types/selection-modal-search-result';

/**
 * @internal
 */
@Component({
  selector: 'sky-selection-modal',
  templateUrl: './selection-modal.component.html',
  styleUrls: ['./selection-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyInfiniteScrollModule,
    SkyLookupResourcesModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkySelectionModalItemSelectedPipe,
    SkyThemeModule,
    SkyToolbarModule,
    SkyWaitModule,
    SkyViewkeeperModule,
  ],
})
export class SkySelectionModalComponent implements OnInit, OnDestroy {
  /**
   * @internal
   * Fires when users select the button to add new options to the list.
   */
  public addClick = new Subject<void>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public displayedItems: any[] = [];

  public hasMoreItems = false;

  /**
   * Used to associate this modal with its owning lookup component.
   */
  public id: string;

  public isLoadingMore = false;

  public isSearching = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public items: any[] = [];

  public onlyShowSelected = false;

  public repeaterItemTemplate: TemplateRef<unknown> | null = null;

  public searchText: string | undefined;

  public selectedIdMap = new Map<unknown, unknown>();

  #continuationData: unknown;

  #currentSearchSub: Subscription | undefined;

  #ngUnsubscribe = new Subject<void>();

  #offset = 0;

  protected readonly context = inject(SkySelectionModalContext);
  protected readonly modalInstance = inject(SkyModalInstance);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #idSvc = inject(SkyIdService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  constructor() {
    this.id = this.#idSvc.generateId();
  }

  public ngOnInit(): void {
    this.repeaterItemTemplate = this.context.userConfig.itemTemplate || null;
    this.searchText = this.context.initialSearch;

    this.#createInitialSelectedItemsMap();
    this.#loadSearchResults();
  }

  public ngOnDestroy(): void {
    this.#cancelCurrentSearch();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
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

    this.#changeDetector.markForCheck();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public itemClick(selectedItem: any): void {
    if (this.context.selectMode === 'single') {
      this.onItemSelect(!selectedItem.selected, selectedItem);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public addItem(itemToAdd: any): void {
    // Add the selected item, then perform the search again in case the
    // newly-added item should be displayed as a search results.
    this.#offset = 0;
    this.onItemSelect(true, itemToAdd);
    this.#loadSearchResults();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  public searchApplied(searchText: string): void {
    this.#offset = 0;
    this.searchText = searchText;

    this.#loadSearchResults();
  }

  public selectAll(): void {
    this.selectedIdMap = new Map();

    for (const item of this.items) {
      this.selectedIdMap.set(item[this.context.idProperty], item);
    }

    this.updateDisplayedItems();
  }

  public infiniteScrollEnd(): void {
    this.#cancelCurrentSearch();

    /* Sanity check - else case would only happen if this was called directly */
    /* istanbul ignore else */
    if (this.hasMoreItems) {
      this.isLoadingMore = true;

      this.#performSearch((result) => {
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
      }),
    ).sort((a, b) => {
      return this.items.indexOf(a.itemData) < this.items.indexOf(b.itemData)
        ? -1
        : 1;
    });

    this.modalInstance.save(selectedItems);
  }

  public updateDisplayedItems(): void {
    const selectedItems = this.items.filter((item) =>
      this.selectedIdMap.has(item[this.context.idProperty]),
    );

    if (this.onlyShowSelected) {
      if (!this.searchText) {
        this.displayedItems = Array.from(this.selectedIdMap.values());
      } else {
        this.displayedItems = selectedItems;
      }
    } else {
      this.displayedItems = this.items;
    }

    setTimeout(() => {
      this.#announceSelectionState(
        selectedItems.length,
        this.displayedItems.length,
      );
      this.#changeDetector.markForCheck();
    });
  }

  #loadSearchResults(): void {
    this.#cancelCurrentSearch();

    this.isSearching = true;

    this.#performSearch((result) => {
      this.isSearching = false;
      this.items = result.items;
    });

    this.#changeDetector.markForCheck();
  }

  #createInitialSelectedItemsMap(): void {
    this.selectedIdMap = new Map(
      this.context.initialValue.map((item) => [
        (item as Record<string, unknown>)[this.context.idProperty],
        item,
      ]),
    );
  }

  #performSearch(
    processResults: (result: SkySelectionModalSearchResult) => void,
  ): void {
    this.#currentSearchSub = this.context
      .searchAsync({
        displayType: 'modal',
        offset: this.#offset,
        searchText: this.searchText || '',
        continuationData: this.#continuationData,
      })
      .pipe(take(1))
      .subscribe((result) => {
        processResults(result);

        this.#continuationData = result.continuationData;
        this.hasMoreItems = result.hasMore || false;
        this.#offset = this.items.length;

        this.updateDisplayedItems();

        this.#changeDetector.markForCheck();
      });
  }

  #cancelCurrentSearch(): void {
    if (this.#currentSearchSub) {
      this.#currentSearchSub.unsubscribe();
      this.#currentSearchSub = undefined;
      this.isLoadingMore = false;
      this.isSearching = false;
    }
  }

  #announceSelectionState(
    selectedItemCount: number,
    displayedItemCount: number,
  ): void {
    this.#resourcesSvc
      .getString(
        'skyux_lookup_show_more_displayed_items_updated',
        selectedItemCount.toString(),
        displayedItemCount.toString(),
      )
      .pipe(take(1))
      .subscribe((resourceString) => {
        this.#liveAnnouncerSvc.announce(resourceString);
      });
  }
}
