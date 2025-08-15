import { CommonModule, NgTemplateOutlet } from '@angular/common';
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
import { SKY_FILTER_ITEM } from './filter-item.token';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarItem } from './models/filter-bar-item';
import { SkyFilterItem } from './models/filter-item';

/**
 * The top-level filter bar component.
 */
@Component({
  selector: 'sky-filter-bar',
  imports: [
    CommonModule,
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
  public readonly filters = model<SkyFilterBarFilterItem[] | undefined>();

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

  readonly #confirmSvc = inject(SkyConfirmService);
  readonly #filterBarSvc = inject(SkyFilterBarService);
  readonly #filterUpdated = toSignal(this.#filterBarSvc.filterItemUpdated);
  readonly #modalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);
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
    // Subscribe to child filter updates
    effect(() => {
      const updatedFilter = this.#filterUpdated();
      if (updatedFilter) {
        this.#updateFilter(updatedFilter);
      }
    });

    // Push filter value
    effect(() => {
      const filters = this.filters();
      this.#updateFilters(filters);
    });
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
      descriptorProperty: 'name',
      idProperty: 'id',
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
        this.filters.set(undefined);
      }
    });
  }

  #getExistingFilterItems(): SkyFilterBarItem[] {
    /* istanbul ignore next: safety check */
    const selectedIds = this.selectedFilterIds() ?? [];
    return this.filterItems()
      .filter((item) => selectedIds.includes(item.filterId()))
      .map((item) => ({
        id: item.filterId(),
        name: item.labelText(),
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

    const selectedIds = newFilterItems.map((item) => item.id);
    this.selectedFilterIds.set(selectedIds);

    if (removedFilterItems.length) {
      this.#updateFilters(removedFilterItems);
      const newFilters = newFilterItems.filter(
        (filter) => !!filter.filterValue,
      );
      this.filters.set(newFilters.length ? newFilters : undefined);
    }
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
      if (this.#isFilterSelected(existingFilter.id, selectedFilters)) {
        newFilterItems.push({
          id: existingFilter.id,
          filterValue: existingFilter.filterValue,
        });
      } else {
        removedFilterItems.push({ id: existingFilter.id });
      }
    }

    // Add newly selected filters
    if (selectedFilters) {
      for (const selectedFilter of selectedFilters) {
        if (!this.#isFilterInList(selectedFilter.id, newFilterItems)) {
          newFilterItems.push({ id: selectedFilter.id });
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
      (selectedFilter) => selectedFilter.id === filterId,
    );
  }

  #isFilterInList(
    filterId: string,
    filterList: SkyFilterBarFilterItem[],
  ): boolean {
    return !!filterList.find((filter) => filter.id === filterId);
  }

  /* istanbul ignore next */
  #filterAsyncSearchFn = (
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> => {
    const items = this.filterItems().map((item) => ({
      id: item.filterId(),
      name: item.labelText(),
    }));

    const results = args.searchText
      ? items.filter((item) =>
          item.name
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
    const filters = untracked(() => this.filters()) ?? [];
    const newFilterValues: SkyFilterBarFilterItem[] = [];

    let replaceFilter = false;
    for (const filterValue of filters) {
      if (filterValue.id === updatedFilter.id) {
        if (updatedFilter.filterValue) {
          newFilterValues.push(updatedFilter);
        }
        replaceFilter = true;
      } else {
        newFilterValues.push(filterValue);
      }
    }

    if (!replaceFilter && updatedFilter.filterValue) {
      newFilterValues.push(updatedFilter);
    }

    this.filters.set(newFilterValues.length ? newFilterValues : undefined);
  }

  #updateFilters(updatedFilters: SkyFilterBarFilterItem[] | undefined): void {
    if (updatedFilters) {
      this.#filterBarSvc.updateFilters(updatedFilters);
    } else {
      this.#filterBarSvc.updateFilters(
        untracked(() => this.filterItems()).map((filterItem) => ({
          id: filterItem.filterId(),
        })),
      );
    }
  }
}
