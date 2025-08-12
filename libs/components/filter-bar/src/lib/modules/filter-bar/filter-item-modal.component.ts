import { CommonModule } from '@angular/common';
import {
  Component,
  TemplateRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { switchMap } from 'rxjs/operators';

import { SkyFilterBarService } from './filter-bar.service';
import { SKY_FILTER_ITEM } from './filter-item.token';
import { SkyFilterBarFilterModalConfig } from './models/filter-bar-filter-modal-config';
import { SkyFilterBarFilterModalContext } from './models/filter-bar-filter-modal-context';
import { SkyFilterItem } from './models/filter-item';

/**
 * A filter bar item component that can display a filter in a modal.
 */
@Component({
  selector: 'sky-filter-item-modal',
  imports: [CommonModule, SkyIconModule],
  templateUrl: './filter-item-modal.component.html',
  styleUrls: ['./filter-item-modal.component.scss'],
  providers: [
    { provide: SKY_FILTER_ITEM, useExisting: SkyFilterItemModalComponent },
  ],
})
export class SkyFilterItemModalComponent implements SkyFilterItem {
  /**
   * A unique identifier for the filter.
   */
  public filterId = input.required<string>();
  /**
   * The label for the filter.
   */
  public labelText = input.required<string>();
  /**
   * The configuration options for showing a custom filter modal.
   */
  public filterModalConfig = input.required<SkyFilterBarFilterModalConfig>();
  /**
   * The template of the filter that is rendered by the filter bar.
   * @internal
   */
  public templateRef = viewChild(TemplateRef<unknown>);

  readonly #modalSvc = inject(SkyModalService);
  readonly #filterBarSvc = inject(SkyFilterBarService);

  public readonly filterValue = toSignal(
    toObservable(this.filterId).pipe(
      switchMap((filterId) =>
        this.#filterBarSvc.getFilterValueUpdates(filterId),
      ),
    ),
  );

  public openFilter(): void {
    const filterModalConfig = this.filterModalConfig();

    const context = new SkyFilterBarFilterModalContext(
      this.labelText(),
      this.filterValue(),
      filterModalConfig.additionalContext,
    );

    const modalConfig: SkyModalConfigurationInterface = {
      providers: [
        {
          provide: SkyFilterBarFilterModalContext,
          useValue: context,
        },
      ],
    };
    if (filterModalConfig.modalSize === 'full') {
      modalConfig.fullPage = true;
    } else {
      modalConfig.size = filterModalConfig.modalSize;
    }

    const instance = this.#modalSvc.open(
      filterModalConfig.modalComponent,
      modalConfig,
    );

    instance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        this.#filterBarSvc.updateFilter({
          id: this.filterId(),
          filterValue: args.data,
        });
      }
    });
  }
}
