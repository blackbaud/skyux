import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  inject,
  input,
  model,
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

import { SkyFilterBarButtonComponent } from './filter-bar-button.component';
import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';
import { SkyFilterBarItem } from './models/filter-bar-item';

/**
 * The top-level filter bar component.
 */
@Component({
  selector: 'sky-filter-bar',
  imports: [
    CommonModule,
    SkyFilterBarButtonComponent,
    SkyFilterBarResourcesModule,
    SkyIconModule,
    SkyToolbarModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class SkyFilterBarComponent {
  /**
   * The filters to be displayed on the filter bar. Filters defined in a provided `SkyDataManagerService` will supersede this input.
   */
  public filters = model<SkyFilterBarFilterItem[] | undefined>();

  /**
   * Whether to include a button to launch a selection modal that adds and removes filters.
   */
  public enableSelectionModal = input<boolean>(false);

  protected filterItems = contentChildren(SkyFilterBarItemComponent);

  protected visibleFilters = computed((): SkyFilterBarItem[] => {
    const activeFilters = this.filters();
    const filterConfigs = this.filterItems();

    const items: SkyFilterBarItem[] = [];
    for (const filter of activeFilters ?? []) {
      const config = filterConfigs.find(
        (item) => item.filterId() === filter.id,
      );

      if (config) {
        items.push({
          id: filter.id,
          name: config.filterName(),
          filterValue: filter.filterValue,
          filterModalConfig: config.filterModalConfig(),
          filterSelectionModalConfig: config.filterSelectionModalConfig(),
        });
      }
    }
    return items;
  });

  protected hasFilters = computed(() => {
    const filters = this.visibleFilters();
    return filters.some((filter) => !!filter.filterValue);
  });

  readonly #confirmSvc = inject(SkyConfirmService);
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

  public openFilters(): void {
    const strings = this.#strings();
    const existingFilters = this.visibleFilters();

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
        const selectedFilters = closeArgs.selectedItems as
          | SkyFilterBarItem[]
          | undefined;
        const newFilters: SkyFilterBarFilterItem[] = [];
        if (existingFilters) {
          for (const existingFilter of existingFilters) {
            if (
              selectedFilters?.find(
                (selectedFilter) => selectedFilter.id === existingFilter.id,
              )
            ) {
              newFilters.push({
                id: existingFilter.id,
                filterValue: existingFilter.filterValue,
              });
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
              newFilters.push({ id: selectedFilter.id });
            }
          }
        }

        this.filters.set(newFilters.length ? newFilters : undefined);
      }
    });
  }

  public updateFilters(
    value: SkyFilterBarFilterValue | undefined,
    filterId: string,
  ): void {
    const filters: SkyFilterBarFilterItem[] = this.visibleFilters().map(
      (filter) => {
        const returnValue: SkyFilterBarFilterItem = {
          id: filter.id,
          filterValue: filter.filterValue,
        };
        if (filter.id === filterId) {
          returnValue.filterValue = value;
        }
        return returnValue;
      },
    );
    this.filters.set(filters);
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
        const filters = this.visibleFilters()?.map((filter) => ({
          id: filter.id,
          filterValue: undefined,
        }));

        this.filters.set(filters);
      }
    });
  }

  /* istanbul ignore next */
  #filterAsyncSearchFn = (
    args: SkySelectionModalSearchArgs,
  ): Observable<SkySelectionModalSearchResult> | undefined => {
    const items = this.filterItems().map((item) => ({
      id: item.filterId(),
      name: item.filterName(),
    }));
    const results = args.searchText
      ? items.filter((item) =>
          item.name.toUpperCase().includes(args.searchText.toUpperCase()),
        )
      : items;
    return of({
      items: results,
      totalCount: items.length,
    } satisfies SkySelectionModalSearchResult);
  };
}
