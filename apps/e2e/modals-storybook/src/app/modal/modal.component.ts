import { Component } from '@angular/core';
import {
  SkyModalConfigurationInterface,
  SkyModalInstance,
  SkyModalService,
} from '@skyux/modals';

import { ModalBasicComponent } from './modals/modal-basic.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  public buttonsHidden = false;

  constructor(private modal: SkyModalService) {}

  public hideButtons(): void {
    this.buttonsHidden = true;
  }
  public showButtons(): void {
    this.buttonsHidden = false;
  }

  public onOpenModalClick(): void {
    this.openModal(ModalBasicComponent);
  }

  public onOpenSmallModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'small' });
  }

  public onOpenMediumModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'medium' });
  }

  public onOpenLargeModalClick(): void {
    this.openModal(ModalBasicComponent, { size: 'large' });
  }

  public onOpenFullPageModalClick(): void {
    this.openModal(ModalBasicComponent, { fullPage: true });
  }

  public onOpenHelpInlineModalClick(): void {
    const modalInstance = this.openModal(ModalBasicComponent);
    modalInstance.componentInstance.showHelp = true;
  }

  private openModal(
    modalInstance: any,
    options?: SkyModalConfigurationInterface
  ): SkyModalInstance {
    this.hideButtons();

    const instance = this.modal.open(modalInstance, options);

    instance.closed.subscribe(() => {
      this.showButtons();
    });

    return instance;
  }
}
