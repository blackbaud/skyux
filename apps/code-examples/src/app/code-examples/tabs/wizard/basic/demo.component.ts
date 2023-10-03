import { Component, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  #modalSize = 'large';

  protected openWizard(): void {
    this.#modalSvc.open(ModalComponent, { size: this.#modalSize });
  }
}
