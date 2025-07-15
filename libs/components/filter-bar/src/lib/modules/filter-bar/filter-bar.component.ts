import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, model } from '@angular/core';
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

import { Observable } from 'rxjs';

import { SkyFilterBarResourcesModule } from '../shared/sky-filter-bar-resources.module';

import { SkyFilterBarItemComponent } from './filter-bar-item.component';
import { SkyFilterBarFilterItem } from './models/filter-bar-filter-item';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

type SelectionModalSearchAsyncFn = (
  args: SkySelectionModalSearchArgs,
) => Observable<SkySelectionModalSearchResult> | undefined;

/**
 * The top-level filter bar component.
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
  /**
   * The filters to be displayed on the filter bar. Filters defined in a provided `SkyDataManagerService` will supersede this input.
   */
  public filters = model<SkyFilterBarFilterItem[] | undefined>();

  /**
   * An asynchronous search function will enable a selection modal so the user can add or remove filters.
   */
  public filterAsyncSearchFn = input<SelectionModalSearchAsyncFn>();

  protected hasFilters = computed(() => {
    const filters = this.filters();

    return filters?.some((filter) => !!filter.filterValue);
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

  protected openFilters(): void {
    const searchFn = this.filterAsyncSearchFn();
    const strings = this.#strings();

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

      if (index > -1) {
        filters[index] = Object.assign({}, filters[index], {
          filterValue: value,
        });
        this.filters.set(filters);
      }
    }
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
        const filters = this.filters()?.map((filter) =>
          Object.assign({}, filter, { filterValue: undefined }),
        );

        if (filters) {
          this.filters.set(filters);
        }
      }
    });
  }
}
