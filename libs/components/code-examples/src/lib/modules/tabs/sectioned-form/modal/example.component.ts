import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Sectioned form inside modal
 */
@Component({
  standalone: true,
  selector: 'app-tabs-sectioned-form-modal-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsSectionedFormModalExampleComponent {
  readonly #modalSvc = inject(SkyModalService);

  public openModal(): void {
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
