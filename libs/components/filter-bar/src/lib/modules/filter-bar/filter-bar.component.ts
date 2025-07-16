import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataManagerService } from '@skyux/data-manager';
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

import { Observable } from 'rxjs';

import { SkyFilterBarResourcesModule } from '../shared/sky-filter-bar-resources.module';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

type SelectionModalSearchAsyncFn = (
  args: SkySelectionModalSearchArgs,
) => Observable<SkySelectionModalSearchResult> | undefined;

/**
 * @internal
 */
@Component({
  selector: 'sky-filter-bar',
  imports: [
    CommonModule,
    SkyFilterBarItemComponent,
    SkyFilterBarResourcesModule,
    SkyIconModule,
    SkyToolbarModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class SkyFilterBarComponent {
  public filters = model<SkyFilterBarFilterItem[] | undefined>();
  public filterAsyncSearchFn = input<SelectionModalSearchAsyncFn>();

  // Computed signal that merges both sources
  public computedFilters = computed(
    (): SkyFilterBarFilterItem[] | undefined => {
      const dataState = this.#dataState();
      const modelFilters = this.filters();

      // Prefer data manager filters if available, otherwise use model filters
      if (dataState?.filterData) {
        return dataState.filterData.filters.filterItems;
      }

      return modelFilters;
    },
  );

  protected hasFilters = computed(() => {
    const filters = this.computedFilters();
    return filters?.some((filter) => !!filter.filterValue);
  });

  readonly #confirmSvc = inject(SkyConfirmService);
  readonly #dataManagerSvc = inject(SkyDataManagerService, { optional: true });
  readonly #modalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);
  readonly #sourceId = 'filterBarComponent';
  readonly #strings = toSignal(
    this.#resourceSvc.getStrings({
      descriptor: 'skyux_filter_bar_filter_picker_descriptor',
      title: 'skyux_filter_bar_clear_filters_confirm_title',
      body: 'skyux_filter_bar_clear_filters_confirm_body',
      save: 'skyux_filter_bar_clear_filters_confirm_apply_label',
      cancel: 'skyux_filter_bar_clear_filters_confirm_cancel_label',
    }),
  );

  #dataState = this.#dataManagerSvc
    ? toSignal(this.#dataManagerSvc.getDataStateUpdates(this.#sourceId))
    : signal(undefined);

  constructor() {
    // Effect to sync data manager changes back to the model signal
    // This ensures the consumer stays in sync when data manager updates
    effect(() => {
      const dataState = this.#dataState();
      if (dataState?.filterData?.filters?.filterItems) {
        // Only update model if it's different to avoid infinite loops
        const currentModel = this.filters();
        const dataManagerFilters = dataState.filterData.filters.filterItems;

        if (
          JSON.stringify(currentModel) !== JSON.stringify(dataManagerFilters)
        ) {
          this.filters.set(dataManagerFilters);
        }
      }
    });
  }

  public openFilters(): void {
    const searchFn = this.filterAsyncSearchFn();
    const strings = this.#strings();
    const existingFilters = this.computedFilters();

    /* istanbul ignore if: safety check */
    if (!strings) {
      return;
    }

    if (searchFn) {
      const filterArgs: SkySelectionModalOpenArgs = {
        selectionDescriptor: strings.descriptor,
        descriptorProperty: 'name',
        idProperty: 'id',
        selectMode: 'multiple',
        value: existingFilters,
        searchAsync: searchFn,
      };
      const modalInstance = this.#modalSvc.open(filterArgs);

      modalInstance.closed.subscribe((closeArgs) => {
        if (closeArgs.reason === 'save') {
          const selectedFilters = closeArgs.selectedItems as
            | SkyFilterBarFilterItem[]
            | undefined;
          const newFilters: SkyFilterBarFilterItem[] = [];
          if (existingFilters) {
            for (const existingFilter of existingFilters) {
              if (
                selectedFilters?.find(
                  (selectedFilter) => selectedFilter.id === existingFilter.id,
                )
              ) {
                newFilters.push(existingFilter);
              }
            }
          }
          if (selectedFilters) {
            for (const selectedFilter of selectedFilters) {
              if (
                !newFilters.find(
                  (newFilter) => newFilter.id === selectedFilter.id,
                )
              ) {
                newFilters.push(selectedFilter);
              }
            }
          }

          this.#updateFilters(newFilters.length ? newFilters : undefined);
        }
      });
    }
  }

  public updateFilters(
    value: SkyFilterBarFilterValue | undefined,
    filter: SkyFilterBarFilterItem,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const filters = [...this.computedFilters()!];
    if (filters.length) {
      const index = filters?.indexOf(filter);

      if (index > -1) {
        filters[index] = Object.assign({}, filters[index], {
          filterValue: value,
        });
        this.#updateFilters(filters);
      }
    }
  }

  public clearFilters(): void {
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
        const filters = this.computedFilters()?.map((filter) =>
          Object.assign({}, filter, { filterValue: undefined }),
        );

        this.#updateFilters(filters);
      }
    });
  }

  #updateFilters(filters: SkyFilterBarFilterItem[] | undefined): void {
    const dataState = this.#dataState();

    // Update data manager if available
    if (dataState?.filterData) {
      dataState.filterData.filtersApplied = !!filters?.some(
        (filter) => !!filter.filterValue,
      );
      dataState.filterData.filters = Object.assign(
        dataState.filterData.filters,
        { filterItems: filters },
      );

      this.#dataManagerSvc?.updateDataState(dataState, this.#sourceId);
    } else {
      // If no data manager, update the model signal directly
      this.filters.set(filters);
    }
  }
}
