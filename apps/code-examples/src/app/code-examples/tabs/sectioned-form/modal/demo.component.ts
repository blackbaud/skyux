import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  protected openModal(): void {
    const modalInstance = this.#modalSvc.open(ModalComponent, {
      size: 'large',
    });

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason === 'cancel') {
        console.log(`Modal cancelled`);
      } else if (result.reason === 'save') {
        console.log(`Modal saved`);
      }
    });
  }
}
