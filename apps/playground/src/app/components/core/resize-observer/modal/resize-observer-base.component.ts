import { Component } from '@angular/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ResizeObserverModalComponent } from './resize-observer-modal.component';

@Component({
  selector: 'app-resize-observer-base',
  templateUrl: './resize-observer-base.component.html',
  standalone: false,
})
export class ResizeObserverBaseComponent {
  constructor(private modalService: SkyModalService) {}

  public onOpenModalClick(size: 'small' | 'medium' | 'large'): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
      providers: [
        {
          provide: 'size',
          useValue: size,
        },
      ],
    };

    this.modalService.open(modalInstanceType, options);
  }
}
