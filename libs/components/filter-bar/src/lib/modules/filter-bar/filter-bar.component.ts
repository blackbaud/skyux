import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  model,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterAdapterData, SkyFilterAdapterService } from '@skyux/lists';
import {
  SkySelectionModalOpenArgs,
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';
import {
  SkyConfirmConfig,
  SkyConfirmService,
  SkyConfirmType,
} from '@skyux/modals';

import { Observable, of } from 'rxjs';

import { SkyFilterBarResourcesModule } from '../shared/sky-filter-bar-resources.module';

import { SkyFilterBarService } from './filter-bar.service';
import { SKY_FILTER_ITEM } from './filter-items/filter-item.token';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarItem } from './models/filter-bar-item';
import { SkyFilterItem } from './models/filter-item';

/**
 * The top-level filter bar component.
 */
@Component({
  selector: 'sky-filter-bar',
  imports: [
    NgTemplateOutlet,
    SkyFilterBarResourcesModule,
    SkyIconModule,
    SkyToolbarModule,
  ],
  providers: [SkyFilterBarService],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class SkyFilterBarComponent {
  /**
   * An array of filter items containing the IDs and values of the filters that have been set.
   */
  public readonly appliedFilters = model<
    SkyFilterBarFilterItem[] | undefined
  >();

  /**
   * An array of filter IDs that the user has selected using the built-in selection modal. Setting this input to undefined results in all filters being displayed.
   */
  public readonly selectedFilterIds = model<string[] | undefined>();

  protected readonly filterItems = contentChildren(SKY_FILTER_ITEM);

  protected readonly visibleFilters = computed((): SkyFilterItem[] => {
    const items = this.filterItems();
    const selectedFilters = this.selectedFilterIds();

    const visibleFilters: (SkyFilterItem | undefined)[] = [];

    if (items) {
      if (selectedFilters) {
        for (const id of selectedFilters) {
          visibleFilters.push(items.find((item) => item.filterId() === id));
        }
      } else {
        for (const item of items) {
          visibleFilters.push(item);
        }
      }
    }

    return visibleFilters.filter((item) => !!item);
  });

  readonly #adapterSvc = inject(SkyFilterAdapterService, { optional: true });
  readonly #confirmSvc = inject(SkyConfirmService);
  readonly #filterBarSvc = inject(SkyFilterBarService);
  readonly #filterItemUpdated = toSignal(this.#filterBarSvc.filterItemUpdated);
  readonly #modalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);
  readonly #sourceId = 'skyFilterBar';
  readonly #strings = toSignal(
    this.#resourceSvc.getStrings({
      descriptor: 'skyux_filter_bar_filter_picker_descriptor',
      title: 'skyux_filter_bar_clear_filters_confirm_title',
      body: 'skyux_filter_bar_clear_filters_confirm_body',
      save: 'skyux_filter_bar_clear_filters_confirm_apply_label',
      cancel: 'skyux_filter_bar_clear_filters_confirm_cancel_label',
    }),
  );

  constructor() {
    // Subscribe to filter value updates from child filter items
    effect(() => {
      const updatedFilter = this.#filterItemUpdated();
      if (updatedFilter) {
        this.#updateFilter(updatedFilter);
      }
    });

    // Push filter value updates to child filter items
    effect(() => {
      const filters = this.appliedFilters();
      this.#updateFilters(filters);
    });

    // If an adapter service is present, subscribe to its updates and reflect into local signals.
    if (this.#adapterSvc) {
      const adapterUpdates = toSignal<SkyFilterAdapterData>(
        this.#adapterSvc.getFilterDataUpdates(this.#sourceId),
      );

      effect(() => {
        const data = adapterUpdates();
        if (data) {
          this.appliedFilters.set(data.appliedFilters);
          this.selectedFilterIds.set(data.selectedFilterIds);
        }
      });
    }
  }

  protected openFilters(): void {
    const strings = this.#strings();
    const existingFilters = this.#getExistingFilterItems();

    /* istanbul ignore if: safety check */
    if (!strings) {
      return;
    }

    const filterArgs: SkySelectionModalOpenArgs = {
      selectionDescriptor: strings.descriptor,
      descriptorProperty: 'labelText',
      idProperty: 'filterId',
      selectMode: 'multiple',
      value: existingFilters,
      searchAsync: this.#filterAsyncSearchFn,
    };

    const modalInstance = this.#modalSvc.open(filterArgs);

    modalInstance.closed.subscribe((closeArgs) => {
      if (closeArgs.reason === 'save') {
        this.#handleFilterSelection(
          closeArgs.selectedItems as SkyFilterBarItem[] | undefined,
          existingFilters,
        );
      }
    });
  }

  protected clearFilters(): void {
    const strings = this.#strings();

    /* istanbul ignore if: safety check */
    if (!strings) {
      return;
    }

    const config: SkyConfirmConfig = {
      message: strings.title,
      body: strings.body,
      type: SkyConfirmType.Custom,
      buttons: [
        {
          action: 'save',
          text: strings.save,
          styleType: 'primary',
        },
        {
          action: 'cancel',
          text: strings.cancel,
          styleType: 'link',
        },
      ],
    };

    const instance = this.#confirmSvc.open(config);

    instance.closed.subscribe((result) => {
      if (result.action === 'save') {
        this.appliedFilters.set(undefined);
        this.#updateFilterData();
      }
    });
  }

  #getExistingFilterItems(): SkyFilterBarItem[] {
    /* istanbul ignore next: safety check */
    const selectedIds = this.selectedFilterIds() ?? [];
    return this.filterItems()
      .filter((item) => selectedIds.includes(item.filterId()))
      .map((item) => ({
        filterId: item.filterId(),
        labelText: item.labelText(),
        filterValue: item.filterValue(),
      }));
  }

  #handleFilterSelection(
    selectedFilters: SkyFilterBarItem[] | undefined,
    existingFilters: SkyFilterBarItem[],
  ): void {
    const { newFilterItems, removedFilterItems } = this.#processFilterChanges(
      selectedFilters,
      existingFilters,
    );

    const selectedIds = newFilterItems.map((item) => item.filterId);
    this.selectedFilterIds.set(selectedIds);

    if (removedFilterItems.length) {
      this.#updateFilters(removedFilterItems);
      const newFilters = newFilterItems.filter(
        (filter) => !!filter.filterValue,
      );
      this.appliedFilters.set(newFilters.length ? newFilters : undefined);
    }
    this.#updateFilterData();
  }

  #processFilterChanges(
    selectedFilters: SkyFilterBarItem[] | undefined,
    existingFilters: SkyFilterBarItem[],
  ): {
    newFilterItems: SkyFilterBarFilterItem[];
    removedFilterItems: SkyFilterBarFilterItem[];
  } {
    const newFilterItems: SkyFilterBarFilterItem[] = [];
    const removedFilterItems: SkyFilterBarFilterItem[] = [];

    // Process existing filters
    for (const existingFilter of existingFilters) {
      if (this.#isFilterSelected(existingFilter.filterId, selectedFilters)) {
        newFilterItems.push({
          filterId: existingFilter.filterId,
          filterValue: existingFilter.filterValue,
        });
      } else {
        removedFilterItems.push({ filterId: existingFilter.filterId });
      }
    }

    // Add newly selected filters
    if (selectedFilters) {
      for (const selectedFilter of selectedFilters) {
        if (!this.#isFilterInList(selectedFilter.filterId, newFilterItems)) {
          newFilterItems.push({ filterId: selectedFilter.filterId });
        }
      }
    }

    return { newFilterItems, removedFilterItems };
  }

  #isFilterSelected(
    filterId: string,
    selectedFilters: SkyFilterBarItem[] | undefined,
  ): boolean {
    return !!selectedFilters?.find(
      (selectedFilter) => selectedFilter.filterId === filterId,
    );
  }

  #isFilterInList(
    filterId: string,
    filterList: SkyFilterBarFilterItem[],
  ): boolean {
    return !!filterList.find((filter) => filter.filterId === filterId);
  }

  /* istanbul ignore next */
  #filterAsyncSearchFn = (
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> => {
    const items = this.filterItems().map((item) => ({
      filterId: item.filterId(),
      labelText: item.labelText(),
    }));

    const results = args.searchText
      ? items.filter((item) =>
          item.labelText
            .toLocaleUpperCase()
            .includes(args.searchText.toLocaleUpperCase()),
        )
      : items;

    return of({
      items: results,
      totalCount: items.length,
    });
  };

  #updateFilter(updatedFilter: SkyFilterBarFilterItem): void {
    const filters = untracked(() => this.appliedFilters()) ?? [];
    const newFilterValues: SkyFilterBarFilterItem[] = [];

    let replaceFilter = false;
    for (const filterValue of filters) {
      if (filterValue.filterId === updatedFilter.filterId) {
        if (updatedFilter.filterValue) {
          newFilterValues.push(updatedFilter);
        } else {
          this.#updateFilters([updatedFilter]);
        }
        replaceFilter = true;
      } else {
        newFilterValues.push(filterValue);
      }
    }

    if (!replaceFilter && updatedFilter.filterValue) {
      newFilterValues.push(updatedFilter);
    }

    this.appliedFilters.set(
      newFilterValues.length ? newFilterValues : undefined,
    );
    this.#updateFilterData();
  }

  #updateFilters(updatedFilters: SkyFilterBarFilterItem[] | undefined): void {
    if (updatedFilters?.length) {
      this.#filterBarSvc.updateFilters(updatedFilters);
    } else {
      this.#filterBarSvc.updateFilters(
        untracked(() => this.filterItems()).map((filterItem) => ({
          filterId: filterItem.filterId(),
        })),
      );
    }
  }

  #updateFilterData(): void {
    if (this.#adapterSvc) {
      const appliedFilters = untracked(() => this.appliedFilters());
      const selectedFilterIds = untracked(() => this.selectedFilterIds());
      this.#adapterSvc.updateFilterData(
        {
          appliedFilters,
          selectedFilterIds,
        },
        this.#sourceId,
      );
    }
  }
}
