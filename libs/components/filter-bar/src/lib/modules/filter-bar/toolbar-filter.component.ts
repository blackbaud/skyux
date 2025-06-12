import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyToolbarModule } from '@skyux/layout';
import {
  SkySelectionModalOpenArgs,
  SkySelectionModalSearchResult,
  SkySelectionModalService,
} from '@skyux/lookup';

import { Observable, take } from 'rxjs';

@Component({
  selector: 'sky-toolbar-filter',
  imports: [CommonModule, SkyToolbarModule],
  templateUrl: './toolbar-filter.component.html',
  styleUrl: './toolbar-filter.component.scss',
})
export class SkyToolbarFilterComponent {
  public filters = input<any[] | undefined>();
  public filterAsyncSearchFn =
    input<Observable<SkySelectionModalSearchResult>>();

  readonly #modalSvc = inject(SkySelectionModalService);
  readonly #resourceSvc = inject(SkyLibResourcesService);

  #filterPickerDescriptor!: string;

  constructor() {
    this.#resourceSvc
      .getString('filter-picker-descriptor')
      .pipe(take(1))
      .subscribe((resource) => {
        this.#filterPickerDescriptor = resource;
      });
  }

  protected openFilters(): void {
    const filterArgs: SkySelectionModalOpenArgs = {
      selectionDescriptor: this.#filterPickerDescriptor,
      descriptorProperty: 'name',
      idProperty: 'id',
      selectMode: 'multiple',
      value: this.filters(),
      searchAsync: () => this.filterAsyncSearchFn(),
    };
    const modalInstance = this.#modalSvc.open(filterArgs);

    modalInstance.closed.subscribe((closeArgs) => {
      if (closeArgs.reason === 'save') {
      }
    });
  }
}
