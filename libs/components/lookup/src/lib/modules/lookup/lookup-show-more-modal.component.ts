import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
import { SkyToolbarModule } from '@skyux/layout';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, take } from 'rxjs';

import { SkySearchModule } from '../search/search.module';
import { SkyLookupResourcesModule } from '../shared/sky-lookup-resources.module';

import { SkyLookupShowMoreNativePickerContext } from './types/lookup-show-more-native-picker-context';

/**
 * @internal
 * Internal component to implement the native picker.
 */
@Component({
  selector: 'sky-lookup-show-more-modal',
  templateUrl: './lookup-show-more-modal.component.html',
  styleUrls: ['./lookup-show-more-modal.component.scss'],
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
    SkyThemeModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
  ],
})
export class SkyLookupShowMoreModalComponent
  implements AfterViewInit, OnDestroy
{
  /**
   * @internal
   * Fires when users select the button to add new options to the list.
   */
  public addClick = new Subject<void>();

  /**
   * Used to associate this modal with its owning lookup component.
   */
  public id: string;

  public items: any[] = [];

  public itemsLoading = false;

  public dataManagerConfig = {
    sortOptions: [
      {
        id: 'az',
        label: 'Alphabetical (A - Z)',
        descending: false,
        propertyName: 'name',
      },
      {
        id: 'za',
        label: 'Alphabetical (Z - A)',
        descending: true,
        propertyName: 'name',
      },
    ],
  };

  public displayedItems: any[] = [];

  public itemsHaveMore = false;

  public onlyShowSelected = false;

  public repeaterItemTemplate: TemplateRef<unknown> | null = null;

  public searchText = '';

  public selectedItems: { index: number; itemData: any }[] = [];

  #itemIndex = 0;
  #ngUnsubscribe = new Subject<void>();

  protected readonly modalInstance = inject(SkyModalInstance);
  protected readonly context = inject(SkyLookupShowMoreNativePickerContext);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #idSvc = inject(SkyIdService);
  readonly #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);

  constructor() {
    this.id = this.#idSvc.generateId();
  }

  public ngAfterViewInit(): void {
    this.repeaterItemTemplate = this.context.userConfig.itemTemplate || null;
    this.searchText = this.context.initialSearch;
    void this.addItems();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public addButtonClicked(): void {
    this.addClick.next();
  }

  public async addItems(): Promise<void> {
    this.itemsLoading = true;
    if (!this.items || this.items.length === 0) {
      const selectedItems: any[] = this.selectedItems.slice();

      this.items = this.context.items.map((item) => {
        return {
          value: item,
          selected: false,
        };
      });

      this.items.forEach((item) => {
        const isInitialValue: boolean =
          this.context.initialValue === item.value;

        const initialIsArray: boolean = Array.isArray(
          this.context.initialValue,
        );
        const initialValueContainsItem: boolean =
          this.context.initialValue.findIndex(
            (initialItem: any) => initialItem === item.value,
          ) >= 0;

        if (isInitialValue || (initialIsArray && initialValueContainsItem)) {
          item.selected = true;
          const itemIndex = this.items.indexOf(item);
          if (
            selectedItems.findIndex(
              (selectedItem) => selectedItem.index === itemIndex,
            ) < 0
          ) {
            selectedItems.push({ index: itemIndex, itemData: item.value });
          }
        }
      });

      this.selectedItems = selectedItems;
      await this.updateDataState();
      this.#changeDetector.markForCheck();
    }

    // if onlyShowSelected is checked, then only iterate through the initial selection
    const items = this.onlyShowSelected
      ? this.items.filter((item) => item.selected)
      : this.items;

    this.#itemIndex = this.#itemIndex + 10;

    const searchedItems = await this.searchItems(items);

    this.displayedItems = searchedItems.slice(0, this.#itemIndex);

    if (this.#itemIndex > searchedItems.length) {
      this.itemsHaveMore = false;
    } else {
      this.itemsHaveMore = true;
    }
    this.itemsLoading = false;

    this.#announceSelectionState(
      this.selectedItems.length,
      this.displayedItems.length,
    );

    this.#changeDetector.markForCheck();
  }

  public async clearAll(): Promise<void> {
    this.displayedItems.forEach((item) => {
      if (item.selected) {
        item.selected = false;
      }
    });
    this.selectedItems = [];
    await this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public itemClick(selectedItem: any): void {
    if (this.context.selectMode === 'single') {
      void this.onItemSelect(!selectedItem.selected, selectedItem);
    }
  }

  public onItemSelect(newSelectState: boolean, itemToSelect: any): void {
    const items = this.items;

    if (this.context.selectMode === 'single') {
      /* Sanity check - single select mode should only alow for a `true` select state */
      /* istanbul ignore else */
      if (newSelectState) {
        itemToSelect.selected = true;
        items.forEach((item) => {
          if (item.value !== itemToSelect.value) {
            item.selected = false;
          }
        });
        this.displayedItems.forEach((item) => {
          if (item.value !== itemToSelect.value) {
            item.selected = false;
          }
        });
        const itemIndex = items.findIndex(
          (item) => item.value === itemToSelect.value,
        );
        this.selectedItems = [
          { index: itemIndex, itemData: items[itemIndex].value },
        ];
      }
    } else {
      const selectedItems: { index: number; itemData: any }[] =
        this.selectedItems;
      const allItemsIndex = items.findIndex(
        (item) => item.value === itemToSelect.value,
      );
      const selectedItemsIndex = selectedItems.findIndex(
        (selectedItem) => selectedItem.index === allItemsIndex,
      );

      if (newSelectState && selectedItemsIndex === -1) {
        selectedItems.push({
          index: allItemsIndex,
          itemData: items[allItemsIndex].value,
        });
      } else if (!newSelectState && selectedItemsIndex !== -1) {
        selectedItems.splice(selectedItemsIndex, 1);
      }

      this.selectedItems = selectedItems;
    }

    void this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public searchApplied(searchText: string): void {
    /* istanbul ignore else */
    if (this.searchText !== searchText) {
      this.#itemIndex = 10;
      this.modalInstance.scrollContentToTop();
    }
    this.searchText = searchText;
    this.itemsLoading = true;
    this.#changeDetector.detectChanges();

    // We need to ensure that the scroll event makes it all the way through the infinite scroll workflow before updating the data state.
    // Without this, the infinite scroll can add items improperly because it can see the above scroll after the items finish searching.
    setTimeout(() => {
      void this.updateDataState();
    }, 100);
  }

  public searchItems(items: any[]): Promise<any[]> {
    const searchText = this.searchText;

    if (searchText) {
      const resultValues = this.context.search(
        searchText,
        items.map((item) => {
          return item.value;
        }),
        { context: 'modal' },
      );

      if (resultValues instanceof Array) {
        const result = items.filter(
          (item) => resultValues.indexOf(item.value) >= 0,
        );
        return Promise.resolve(result);
      } else {
        return resultValues.then((values) => {
          const result = items.filter(
            (item) => values.indexOf(item.value) >= 0,
          );
          return Promise.resolve(result);
        });
      }
    } else {
      return Promise.resolve(items);
    }
  }

  public async selectAll(): Promise<void> {
    const items = this.items;

    const selectedItems: { index: number; itemData: any }[] =
      this.selectedItems;

    this.displayedItems.forEach((item: any) => {
      if (!item.selected) {
        item.selected = true;

        const index = items.indexOf(item);

        /* istanbul ignore else */
        if (
          selectedItems.findIndex(
            (selectedItem) => selectedItem.index === index,
          ) < 0
        ) {
          selectedItems.push({
            index: index,
            itemData: items[index].value,
          });
        }
      }
    });

    this.selectedItems = selectedItems;
    await this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public async updateDataState(): Promise<void> {
    const items = this.items;

    const selectedItems: { index: number; itemData: any }[] =
      this.selectedItems;

    items?.forEach((item: any, index: number) => {
      item.selected =
        selectedItems.findIndex(
          (selectedItem) => selectedItem.index === index,
        ) !== -1;
    });

    let searchedItems = await this.searchItems(items);

    if (this.onlyShowSelected) {
      searchedItems = searchedItems.filter((item) => item.selected);
    }

    this.displayedItems = searchedItems.slice(0, this.#itemIndex);

    if (this.#itemIndex > searchedItems.length) {
      this.itemsHaveMore = false;
    } else {
      this.itemsHaveMore = true;
    }
    this.itemsLoading = false;

    this.#announceSelectionState(
      selectedItems.length,
      this.displayedItems.length,
    );

    this.#changeDetector.markForCheck();
  }

  public async updateItemData(data: any[]): Promise<void> {
    this.context.items = data;
    this.items = [];
    this.#itemIndex = 10;
    this.selectedItems.forEach((selectedItem) => {
      this.context.items.forEach((item: any, index: number) => {
        if (selectedItem.itemData === item) {
          selectedItem.index = index;
        }
      });
    });

    await this.addItems();

    this.#changeDetector.markForCheck();
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
      .subscribe((resourcesString) => {
        this.#liveAnnouncerSvc.announce(resourcesString);
      });
  }
}
