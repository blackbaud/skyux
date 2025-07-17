import { CommonModule } from '@angular/common';
import { Component, inject, input, model, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import {
  SkySelectionModalOpenArgs,
  SkySelectionModalService,
} from '@skyux/lookup';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { SkyFilterBarFilterModalConfig } from './models/filter-bar-filter-modal-config';
import { SkyFilterBarFilterModalContext } from './models/filter-bar-filter-modal-context';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

/**
 * The component that governs the filters displayed on the filter bar.
 * @internal
 */
@Component({
  selector: 'sky-filter-bar-item',
  imports: [CommonModule, SkyIconModule],
  templateUrl: './filter-bar-item.component.html',
  styleUrl: './filter-bar-item.component.scss',
})
export class SkyFilterBarItemComponent {
  public filterId = input.required<string>();
  public filterName = input.required<string>();
  public filterValue = model<SkyFilterBarFilterValue>();
  public filterModalConfig = input<SkyFilterBarFilterModalConfig>();
  public filterSelectionModalConfig = input<SkySelectionModalOpenArgs>();

  public filterUpdated = output<SkyFilterBarFilterValue | undefined>();

  readonly #modalSvc = inject(SkyModalService);
  readonly #resourcesSvc = inject(SkyLibResourcesService);
  readonly #selectionModalSvc = inject(SkySelectionModalService);

  #multipleSelectionLabel = toSignal(
    this.#resourcesSvc.getString('skyux_filter_item_n_selected'),
  );

  public openFilterModal(): void {
    const filterModalConfig = this.filterModalConfig();
    const selectionModalConfig = this.filterSelectionModalConfig();

    if (selectionModalConfig) {
      selectionModalConfig.value = this.filterValue()?.value as
        | unknown[]
        | undefined;
      const instance = this.#selectionModalSvc.open(selectionModalConfig);

      instance.closed.subscribe((closeArgs) => {
        if (closeArgs.reason === 'save') {
          let result: SkyFilterBarFilterValue | undefined;
          if (closeArgs.selectedItems?.length) {
            result = {
              value: closeArgs.selectedItems,
            };
            if (closeArgs.selectedItems.length > 1) {
              result.displayValue = String(
                this.#multipleSelectionLabel,
              ).replace('{0}', `${closeArgs.selectedItems.length}`);
            } else {
              result.displayValue = (closeArgs.selectedItems[0] as never)[
                selectionModalConfig.descriptorProperty
              ];
            }
          }

          this.filterValue.set(result);
          this.filterUpdated.emit(result);
        }
      });
    } else if (filterModalConfig) {
      const context = new SkyFilterBarFilterModalContext(
        this.filterName(),
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
          this.filterValue.set(args.data);
          this.filterUpdated.emit(args.data);
        }
      });
    }
  }
}
