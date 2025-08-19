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
 * A filter bar item that opens a modal for complex filter configuration.
 * Use this component when your filter requires a rich UI with multiple inputs,
 * date pickers, or other complex controls that don't fit in an inline filter.
 */
@Component({
  selector: 'sky-filter-item-modal',
  imports: [SkyIconModule],
  templateUrl: './filter-item-modal.component.html',
  styleUrls: ['./filter-item-modal.component.scss'],
  providers: [
    { provide: SKY_FILTER_ITEM, useExisting: SkyFilterItemModalComponent },
  ],
})
export class SkyFilterItemModalComponent implements SkyFilterItem {
  public readonly filterId = input.required<string>();
  public readonly labelText = input.required<string>();
  /**
   * The configuration options for showing a custom filter modal.
   */
  public readonly filterModalConfig =
    input.required<SkyFilterBarFilterModalConfig>();
  public readonly templateRef = viewChild(TemplateRef<unknown>);

  readonly #modalSvc = inject(SkyModalService);
  readonly #filterBarSvc = inject(SkyFilterBarService);

  public readonly filterValue = toSignal(
    toObservable(this.filterId).pipe(
      switchMap((filterId) =>
        this.#filterBarSvc.getFilterValueUpdates(filterId),
      ),
    ),
  );

  protected openFilter(): void {
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
          filterId: this.filterId(),
          filterValue: args.data,
        });
      }
    });
  }
}
