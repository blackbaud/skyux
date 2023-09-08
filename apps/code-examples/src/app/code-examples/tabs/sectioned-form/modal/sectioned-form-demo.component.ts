import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';

import { SectionedFormModalDemoComponent } from './sectioned-form-modal-demo.component';

@Component({
  selector: 'app-sectioned-form-demo',
  templateUrl: './sectioned-form-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionedFormDemoComponent {
  readonly #modalSvc = inject(SkyModalService);

  public openModal(): void {
    const modalInstance = this.#modalSvc.open(SectionedFormModalDemoComponent, {
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
