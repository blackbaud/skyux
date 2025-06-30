import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import {
  SkySelectionModalOpenArgs,
  SkySelectionModalSearchArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { Observable, take } from 'rxjs';

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

  protected hasFilters = computed(() => {
    const filters = this.filters();

    return filters?.some((filter) => !!filter.filterValue);
  });

  readonly #modalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);

  #filterPickerDescriptor = 'filters';

  constructor() {
    this.#resourceSvc
      .getString('skyux_filter_bar_filter_picker_descriptor')
      .pipe(take(1))
      .subscribe((resource) => {
        this.#filterPickerDescriptor = resource;
      });
  }

  protected openFilters(): void {
    const searchFn = this.filterAsyncSearchFn();

    if (searchFn) {
      const filterArgs: SkySelectionModalOpenArgs = {
        selectionDescriptor: this.#filterPickerDescriptor,
        descriptorProperty: 'name',
        idProperty: 'id',
        selectMode: 'multiple',
        value: this.filters(),
        searchAsync: searchFn,
      };
      const modalInstance = this.#modalSvc.open(filterArgs);

      modalInstance.closed.subscribe((closeArgs) => {
        if (closeArgs.reason === 'save') {
          this.filters.set(
            closeArgs.selectedItems as SkyFilterBarFilterItem[] | undefined,
          );
        }
      });
    }
  }

  protected updateFilters(
    value: SkyFilterBarFilterValue | undefined,
    filter: SkyFilterBarFilterItem,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const filters = [...this.filters()!];
    if (filters.length) {
      const index = filters?.indexOf(filter);
      filters[index].filterValue = value;

      this.filters.set(filters);
    }
  }

  protected clearFilters(): void {
    const filters = this.filters()?.map((filter) => {
      filter.filterValue = undefined;
      return filter;
    });

    if (filters) {
      this.filters.set(filters);
    }
  }
}
