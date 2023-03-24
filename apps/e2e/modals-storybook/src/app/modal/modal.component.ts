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

  public onOpenModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [],
    });
  }

  public onOpenSmallModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [],
      size: 'small',
    });
  }

  public onOpenMediumModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [],
      size: 'medium',
    });
  }

  public onOpenLargeModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [],
      size: 'large',
    });
  }

  public onOpenFullPageModalClick(): void {
    this.openModal(ModalBasicComponent, {
      providers: [],
      fullPage: true,
    });
  }

  public onOpenHelpInlineModalClick(): void {
    const modalInstance = this.openModal(ModalBasicComponent, {
      providers: [],
    });
    modalInstance.componentInstance.showHelp = true;
  }
}
