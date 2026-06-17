import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import {
  ResizeObserverModalComponent,
  SIZE_TOKEN,
} from './resize-observer-modal.component';

@Component({
  selector: 'app-resize-observer-base',
  templateUrl: './resize-observer-base.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ResizeObserverBaseComponent {
  readonly #modalService = inject(SkyModalService);

  public onOpenModalClick(size: 'small' | 'medium' | 'large'): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
      providers: [
        {
          provide: SIZE_TOKEN,
          useValue: size,
        },
      ],
    };

    this.#modalService.open(modalInstanceType, options);
  }
}
