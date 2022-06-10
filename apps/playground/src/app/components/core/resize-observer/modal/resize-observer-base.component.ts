import { Component } from '@angular/core';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { ResizeObserverModalComponent } from './resize-observer-modal.component';

@Component({
  selector: 'app-resize-observer-base',
  templateUrl: './resize-observer-base.component.html',
})
export class ResizeObserverBaseComponent {
  public sizes: ('small' | 'medium' | 'large' | 'default')[] = [
    'small',
    'medium',
    'large',
    'default',
  ];

  constructor(private modalService: SkyModalService) {}

  public onOpenModalClick(
    size: 'small' | 'medium' | 'large' | 'default',
    variation: 'responsive' | 'plain' = 'responsive'
  ): void {
    const modalInstanceType = ResizeObserverModalComponent;
    const options: SkyModalConfigurationInterface = {
      size,
      providers: [
        {
          provide: 'size',
          useValue: size,
        },
        {
          provide: 'variation',
          useValue: variation,
        },
      ],
    };

    this.modalService.open(modalInstanceType, options);
  }
}
