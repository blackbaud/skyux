import { Component } from '@angular/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ResizeObserverModalComponent } from './resize-observer-modal.component';

@Component({
  selector: 'app-resize-observer-base',
  templateUrl: './resize-observer-base.component.html',
})
export class ResizeObserverBaseComponent {
  constructor(private modal: SkyModalService) {}

  public onOpenModalClick(size: 'small' | 'medium' | 'large'): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
    };

    this.modal.open(modalInstanceType, options);
  }
}
