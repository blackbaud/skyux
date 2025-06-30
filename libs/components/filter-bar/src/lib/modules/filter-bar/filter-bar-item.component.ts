import { CommonModule } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { SkyFilterBarFilterModalConfig } from './models/filter-bar-filter-modal-config';
import { SkyFilterBarFilterModalContext } from './models/filter-bar-filter-modal-context';
import { SkyFilterBarFilterValue } from './models/filter-bar-filter-value';

/**
 * @internal
 */
@Component({
  selector: 'sky-filter-bar-item',
  imports: [CommonModule, SkyIconModule],
  templateUrl: './filter-bar-item.component.html',
  styleUrl: './filter-bar-item.component.scss',
})
export class SkyFilterBarItemComponent {
  public filterName = input.required<string>();
  public filterValue = model<SkyFilterBarFilterValue>();
  public filterModalConfig = input<SkyFilterBarFilterModalConfig>();

  #modalSvc = inject(SkyModalService);

  public openFilterModal(): void {
    const config = this.filterModalConfig();

    if (config) {
      const context = new SkyFilterBarFilterModalContext(
        this.filterName(),
        this.filterValue(),
        config.additionalContext,
      );

      const modalConfig: SkyModalConfigurationInterface = {
        providers: [
          {
            provide: SkyFilterBarFilterModalContext,
            useValue: context,
          },
        ],
      };
      if (config.modalSize === 'full') {
        modalConfig.fullPage = true;
      } else {
        modalConfig.size = config.modalSize;
      }

      const instance = this.#modalSvc.open(config.modalComponent, modalConfig);

      instance.closed.subscribe((args) => {
        if (args.reason === 'save') {
          this.filterValue.set(args.data);
        }
      });
    }
  }
}
