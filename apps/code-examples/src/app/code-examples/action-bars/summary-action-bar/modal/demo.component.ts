import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { DemoModalComponent } from './demo-modal.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    this.#modalSvc.open(DemoModalComponent, {
      size: 'large',
    });
  }
}
