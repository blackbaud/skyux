import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
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
    SkyFilterBarResourcesModule,
    SkyIconModule,
    SkyToolbarModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
})
export class SkyFilterBarComponent {
  public filters = input<unknown[] | undefined>();
  public filterAsyncSearchFn = input<SelectionModalSearchAsyncFn>();

  protected displayedFilters: unknown[] | undefined;
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

    effect(() => {
      const newFilters = this.filters();

      this.#updateDisplayedFilters(newFilters);
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
        value: this.displayedFilters,
        searchAsync: searchFn,
      };
      const modalInstance = this.#modalSvc.open(filterArgs);

      modalInstance.closed.subscribe((closeArgs) => {
        if (closeArgs.reason === 'save') {
          this.#updateDisplayedFilters(closeArgs.selectedItems);
        }
      });
    }
  }

  #updateDisplayedFilters(items: unknown[] | undefined): void {
    this.displayedFilters = items;
  }
}
