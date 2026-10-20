import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { SkyButton } from '@skyux/forms';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';

import { ModalComponent } from './modal.component';

/**
 * @title Modal with banner
 */
@Component({
  selector: 'app-modals-modal-basic-with-controller-example',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton],
  template: `<sky-button
    labelText="Open modal example"
    (buttonClick)="openModal()"
  />`,
})
export class ModalsModalBasicWithBannerExampleComponent implements OnDestroy {
  readonly #instances: SkyModalInstance[] = [];
  readonly #modalSvc = inject(SkyModalService);

  public ngOnDestroy(): void {
    this.#instances.forEach((i) => {
      i.close();
    });
  }

  public openModal(): void {
    const instance = this.#modalSvc.open(ModalComponent);

    this.#instances.push(instance);
  }
}
