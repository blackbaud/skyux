import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [SkyModalModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './modal-banner-image.component.html',
})
export class ModalBannerImageComponent {
  readonly #instance = inject(SkyModalInstance);

  protected closeClick(): void {
    this.#instance.close();
  }
}
