import { Component, inject } from '@angular/core';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  imports: [SkyModalModule],
  templateUrl: './modal-banner-content.component.html',
  styleUrl: './modal-banner-content.component.scss',
})
export class ModalBannerContentComponent {
  readonly #instance = inject(SkyModalInstance);

  protected closeClick(): void {
    this.#instance.close();
  }
}
