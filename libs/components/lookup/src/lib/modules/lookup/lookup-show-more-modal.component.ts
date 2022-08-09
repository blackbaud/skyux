import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';
import { SkyModalInstance } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SkyLookupShowMoreNativePickerContext } from './types/lookup-show-more-native-picker-context';

/**
 * @internal
 * Internal component to implement the native picker.
 */
@Component({
  // Suppress this error rather than fix the selector since consumers with unit tests
  // may be looking for an element with this selector. We can change it in the next major
  // version of SKY UX.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'skyux-lookup-show-more-modal',
  templateUrl: './lookup-show-more-modal.component.html',
  styleUrls: ['./lookup-show-more-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyLookupShowMoreModalComponent
  implements AfterViewInit, OnDestroy
{
  public id: string;

  /**
   * @internal
   * Fires when users select the button to add new options to the list.
   */
  public addClick: Subject<void> = new Subject();

  public items: any[] = [];

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

  #changeDetector: ChangeDetectorRef;

  #itemIndex = 0;

  #ngUnsubscribe = new Subject<void>();

  constructor(
    public modalInstance: SkyModalInstance,
    public context: SkyLookupShowMoreNativePickerContext,
    changeDetector: ChangeDetectorRef,
    idSvc: SkyIdService
  ) {
    this.id = idSvc.generateId();
    this.#changeDetector = changeDetector;
  }

  public ngAfterViewInit(): void {
    this.repeaterItemTemplate = this.context.userConfig.itemTemplate || null;
    this.searchText = this.context.initialSearch;
    this.addItems();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public addButtonClicked(): void {
    this.addClick.next();
  }

  public addItems(): void {
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
          this.context.initialValue
        );
        const initialValueContainsItem: boolean =
          this.context.initialValue.findIndex(
            (initialItem: any) => initialItem === item.value
          ) >= 0;

        if (isInitialValue || (initialIsArray && initialValueContainsItem)) {
          item.selected = true;
          const itemIndex = this.items!.indexOf(item);
          if (
            selectedItems.findIndex(
              (selectedItem) => selectedItem.index === itemIndex
            ) < 0
          ) {
            selectedItems.push({ index: itemIndex, itemData: item.value });
          }
        }
      });

      this.selectedItems = selectedItems;
      this.updateDataState();
      this.#changeDetector.markForCheck();
    }

    this.#itemIndex = this.#itemIndex + 10;
    this.searchItems(this.items).then((searchedItems) => {
      this.displayedItems = searchedItems.slice(0, this.#itemIndex);

      if (this.#itemIndex > searchedItems.length) {
        this.itemsHaveMore = false;
      } else {
        this.itemsHaveMore = true;
      }
      this.#changeDetector.markForCheck();
    });
  }

  public clearAll(): void {
    this.displayedItems.forEach((item) => {
      if (item.selected) {
        item.selected = false;
      }
    });
    this.selectedItems = [];
    this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public itemClick(selectedItem: any): void {
    if (this.context.selectMode === 'single') {
      this.onItemSelect(!selectedItem.selected, selectedItem);
    }
  }

  public onItemSelect(newSelectState: boolean, itemToSelect: any): void {
    const items = this.items!;

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
          (item) => item.value === itemToSelect.value
        );
        this.selectedItems = [
          { index: itemIndex, itemData: items[itemIndex].value },
        ];
      }
    } else {
      const selectedItems: { index: number; itemData: any }[] =
        this.selectedItems;
      const allItemsIndex = items.findIndex(
        (item) => item.value === itemToSelect.value
      );
      const selectedItemsIndex = selectedItems.findIndex(
        (selectedItem) => selectedItem.index === allItemsIndex
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
    this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public searchApplied(searchText: string) {
    /* istanbul ignore else */
    if (this.searchText !== searchText) {
      this.#itemIndex = 10;
    }
    this.searchText = searchText;
    this.updateDataState();
  }

  public searchItems(items: any[]): Promise<any[]> {
    const searchText = this.searchText;

    if (searchText) {
      const resultValues = this.context.search(
        searchText,
        items.map((item) => {
          return item.value;
        })
      );

      if (resultValues instanceof Array) {
        const result = items.filter(
          (item) => resultValues.indexOf(item.value) >= 0
        );
        return Promise.resolve(result);
      } else {
        return resultValues.then((values) => {
          const result = items.filter(
            (item) => values.indexOf(item.value) >= 0
          );
          return Promise.resolve(result);
        });
      }
    } else {
      return Promise.resolve(items);
    }
  }

  public selectAll(): void {
    const items = this.items!;

    const selectedItems: { index: number; itemData: any }[] =
      this.selectedItems;

    this.displayedItems.forEach((item: any) => {
      if (!item.selected) {
        item.selected = true;

        const index = items.indexOf(item);

        /* istanbul ignore else */
        if (
          selectedItems.findIndex(
            (selectedItem) => selectedItem.index === index
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
    this.updateDataState();
    this.#changeDetector.markForCheck();
  }

  public updateDataState(): void {
    const items = this.items!;

    const selectedItems: { index: number; itemData: any }[] =
      this.selectedItems;
    items.forEach((item: any, index: number) => {
      item.selected =
        selectedItems.findIndex(
          (selectedItem) => selectedItem.index === index
        ) !== -1;
    });

    this.searchItems(items).then((searchedItems) => {
      if (this.onlyShowSelected) {
        searchedItems = searchedItems.filter((item) => item.selected);
      }
      this.displayedItems = searchedItems.slice(0, this.#itemIndex);

      if (this.#itemIndex > searchedItems.length) {
        this.itemsHaveMore = false;
      } else {
        this.itemsHaveMore = true;
      }

      this.#changeDetector.markForCheck();
    });
  }

  public updateItemData(data: any[]): void {
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

    this.addItems();

    this.#changeDetector.markForCheck();
  }
}
